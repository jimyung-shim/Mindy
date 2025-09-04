import { Injectable } from '@nestjs/common';
import { McpRegistryService } from '../mcp/mcp.registry';
import OpenAI from 'openai';
import type { PersonaKey } from '../persona/persona.types';
import { imageUrlFor, labelFor } from '../persona/persona.images';
import { z } from 'zod';

@Injectable()
export class AgentService {
  private readonly mode = 'PERSONA_ASSIGN_STRATEGY'.toLowerCase();
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(private readonly mcp: McpRegistryService) {}

  async assignViaAgent(categories: string[]): Promise<AssignResponse> {
    // 실제로는 OpenAI Agents SDK를 써서 Hosted MCP 툴을 호출할 수 있지만,
    // 지금은 툴을 바로 실행해 동일한 payload를 얻는다.
    const tool = this.mcp.get('assign_persona');
    const input = { categories };
    const parsed = tool.inputSchema.parse(input);
    const result = (await tool.run(parsed)) as AssignResponse;
    return result;
  }

  async assign(categories: string[]): Promise<AssignResponse> {
    if (this.mode === 'openai') {
      try {
        return await this.assignViaOpenAI(categories);
      } catch (e) {
        // 실패 시 안전하게 local로 폴백
        console.warn('[assignViaOpenAI failed] falling back to local:', e);
        return this.assignViaLocal(categories);
      }
    }
    return this.assignViaLocal(categories);
  }

  // 기존: 레지스트리에서 툴 직접 실행(= 서버 내부 계산)
  private async assignViaLocal(categories: string[]): Promise<AssignResponse> {
    const tool = this.mcp.get('assign_persona');
    const parsed = tool.inputSchema.parse({ categories });
    const result = (await tool.run(parsed)) as {
      personaKey: PersonaKey;
      personaLabel: string;
      reason: string;
    };
    return { ...result, imageUrl: imageUrlFor(result.personaKey) };
  }

  // 신규: OpenAI 구조화 출력(JSON Schema)로 모델이 판단
  private async assignViaOpenAI(categories: string[]): Promise<AssignResponse> {
    // 1) 스키마: personaKey enum을 “정해진 키들”로 강제
    const personaEnum: PersonaKey[] = [
      'ECONOMY',
      'JOB',
      'RELATION',
      'BODY',
      'FAMILY',
      'ECONOMY+JOB',
      'ECONOMY+RELATION',
      'ECONOMY+BODY',
      'ECONOMY+FAMILY',
      'JOB+RELATION',
      'JOB+BODY',
      'JOB+FAMILY',
      'RELATION+BODY',
      'RELATION+FAMILY',
      'BODY+FAMILY',
    ];

    // 2) 시스템 지시 + 입력
    const system = [
      '너는 사용자 선택 카테고리를 기반으로 상담 페르소나를 1개 배정한다.',
      '반드시 제공된 enum 중 하나의 personaKey를 선택한다.',
      'reason은 한국어로 1~2문장, 간결하게 배정 근거를 요약한다.',
    ].join('\n');

    const user = JSON.stringify({ categories }, null, 2);

    const res: unknown = await this.openai.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-5-nano',
      input: [
        { role: 'system', content: system },
        { role: 'user', content: `선택 카테고리:\n${user}` },
      ],
      tools: [
        {
          type: 'function',
          name: 'finalize_persona',
          description:
            '선택 카테고리로 최종 페르소나를 결정하고 사유를 한국어로 간결히 설명한다.',
          strict: true,
          parameters: {
            type: 'object',
            additionalProperties: false,
            properties: {
              personaKey: { type: 'string', enum: personaEnum },
              reason: { type: 'string', minLength: 3, maxLength: 200 },
            },
            required: ['personaKey', 'reason'],
          },
        },
      ],
      tool_choice: { type: 'function', name: 'finalize_persona' },
    });

    // ✅ Single, safe path: validate + narrow with Zod
    const args = extractFinalizeArgs(res);
    if (!args) throw new Error('No tool_call result from model');

    const { personaKey, reason } = args;
    const personaLabel = labelFor(personaKey);
    const imageUrl = imageUrlFor(personaKey);
    return { personaKey, personaLabel, reason, imageUrl };
  }
}

type AssignResponse = {
  personaKey: string;
  personaLabel: string;
  reason: string;
  imageUrl?: string;
};

// 응답 content 아이템 타입(로컬 정의)
type ToolCallContent =
  | { type: 'tool_call'; name?: string; tool_name?: string; arguments: unknown }
  | { type: 'output_text'; text: string }
  | { type: string }; // 기타 케이스 방어

type OutputBlock = { content?: ToolCallContent[] };

const personaEnum: PersonaKey[] = [
  'ECONOMY',
  'JOB',
  'RELATION',
  'BODY',
  'FAMILY',
  'ECONOMY+JOB',
  'ECONOMY+RELATION',
  'ECONOMY+BODY',
  'ECONOMY+FAMILY',
  'JOB+RELATION',
  'JOB+BODY',
  'JOB+FAMILY',
  'RELATION+BODY',
  'RELATION+FAMILY',
  'BODY+FAMILY',
];
// finalize_persona의 인자 스키마 (런타임 검증)
const FinalizeArgsSchema = z.object({
  personaKey: z.enum(personaEnum as unknown as [PersonaKey, ...PersonaKey[]]),
  reason: z.string().min(3).max(200),
});
type FinalizeArgs = z.infer<typeof FinalizeArgsSchema>;

// 타입가드: tool_call 판별
function isToolCall(
  x: ToolCallContent,
): x is Extract<ToolCallContent, { type: 'tool_call' }> {
  return x?.type === 'tool_call';
}

// 안전 파서
function extractFinalizeArgs(resp: unknown): FinalizeArgs | null {
  const r = resp as { output?: OutputBlock[] } | null | undefined;
  if (!r?.output) return null;

  for (const block of r.output) {
    const items = block?.content ?? [];
    for (const item of items) {
      if (isToolCall(item)) {
        const toolName = item.name ?? item.tool_name ?? '';
        if (toolName === 'finalize_persona') {
          const raw = item.arguments;
          const obj =
            typeof raw === 'string'
              ? safeJson(raw)
              : raw && typeof raw === 'object'
                ? raw
                : null;

          if (!obj) return null;
          const parsed = FinalizeArgsSchema.safeParse(obj);
          if (parsed.success) return parsed.data;
        }
      }
    }
  }
  return null;
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
