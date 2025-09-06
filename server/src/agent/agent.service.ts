import { Injectable } from '@nestjs/common';
import { McpRegistryService } from '../mcp/mcp.registry';
import OpenAI from 'openai';
import type { PersonaKey } from '../persona/persona.types';
import { imageUrlFor, labelFor } from '../persona/persona.images';
import { z } from 'zod';

const PERSONA_ENUM: PersonaKey[] = [
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
] as const;

// Zod 스키마 (런타임 검증)
const FinalizeSchema = z.object({
  personaKey: z.enum(PERSONA_ENUM as unknown as [PersonaKey, ...PersonaKey[]]),
  reason: z.string().min(3).max(200),
});
type Finalize = z.infer<typeof FinalizeSchema>;

// Responses API용 JSON Schema 포맷 (text.format.jsonSchema에 그대로 사용)
const FINALIZE_JSON_SCHEMA = {
  name: 'finalize_persona',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      personaKey: { type: 'string', enum: PERSONA_ENUM },
      reason: { type: 'string', minLength: 3, maxLength: 200 },
    },
    required: ['personaKey', 'reason'],
  },
} as const;

@Injectable()
export class AgentService {
  private readonly mode: string | undefined =
    process.env.PERSONA_ASSIGN_STRATEGY;
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(private readonly mcp: McpRegistryService) {}

  async assign(categories: string[]): Promise<AssignResponse> {
    if (this.mode === 'openai') {
      try {
        return await this.assignViaOpenAI(categories);
      } catch (e) {
        // 실패 시 안전하게 local로 폴백
        console.warn(
          '[assignViaOpenAI failed] falling back to local:',
          { categories },
          e,
        );
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

  // OpenAI 구조화 출력(JSON Schema)로 모델이 판단
  private async assignViaOpenAI(categories: string[]): Promise<AssignResponse> {
    // 시스템 지시 + 입력
    const system = [
      '너는 사용자 선택 카테고리를 기반으로 상담 페르소나를 1개 배정한다.',
      '반드시 제공된 enum 중 하나의 personaKey를 선택한다.',
      'reason은 한국어로 1~2문장, 간결하게 배정 근거를 요약한다.',
    ].join('\n');

    const user = JSON.stringify({ categories }, null, 2);

    const res = await this.openai.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-5-nano',
      input: [
        { role: 'system', content: system },
        { role: 'user', content: `선택 카테고리:\n${user}` },
      ],
      text: {
        format: {
          type: 'json_schema',
          ...FINALIZE_JSON_SCHEMA,
        },
      },
    });

    const text = res.output_text ?? '';
    const parsedUnsafe = safeJson(text);
    const parsed = FinalizeSchema.safeParse(parsedUnsafe);
    if (!parsed.success) {
      console.warn('Invalid JSON schema output:', {
        raw: text?.slice(0, 500),
        zodError: parsed.error.flatten(),
      });
      throw new Error('Model did not return valid JSON schema output');
    }

    const { personaKey, reason } = parsed.data as Finalize;
    return {
      personaKey,
      personaLabel: labelFor(personaKey),
      reason,
      imageUrl: imageUrlFor(personaKey),
    };
  }
}

type AssignResponse = {
  personaKey: string;
  personaLabel: string;
  reason: string;
  imageUrl?: string;
};

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
