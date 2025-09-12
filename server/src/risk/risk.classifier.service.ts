import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { z } from 'zod';
import { RiskClassification, RiskLevel } from './risk.types';

const RiskSchema = z.object({
  level: z.enum(['none', 'low', 'moderate', 'high']),
  reasons: z.array(z.string()).optional(),
});

@Injectable()
export class RiskClassifierService {
  private readonly log = new Logger(RiskClassifierService.name);
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // 필요 시 대화 맥락까지 받아 판단
  async classify(input: {
    text: string;
    recentMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<RiskClassification> {
    const system = [
      'You are a safety classifier for a mental-health chat app.',
      'Classify the IMMEDIATE RISK in the latest user message.',
      'Return strict JSON with fields: level (none|low|moderate|high) and optional reasons[].',
      'Criteria:',
      '- high: explicit self-harm intent or plan; imminent risk words.',
      '- moderate: persistent suicidal ideation or self-harm thoughts without plan.',
      '- low: depressed mood or vague negative sentiment; no ideation.',
      '- none: general conversation; no mental-health risk signals.',
      'Consider recency; weigh the latest message most.',
    ].join('\n');

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: system },
    ];

    if (input.recentMessages?.length) {
      messages.push({
        role: 'user',
        content: `RECENT_CONTEXT:\n${input.recentMessages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}`,
      });
    }

    messages.push({
      role: 'user',
      content: `LATEST_USER_MESSAGE:\n${input.text}\n\nReturn ONLY JSON.`,
    });

    const res = await this.openai.chat.completions.create({
      model: process.env.OPENAI_RISK_MODEL ?? 'gpt-4o-mini',
      temperature: 0,
      messages,
      // 토큰/비용 아끼고 싶으면 max_tokens 줄여도 됨
      response_format: { type: 'json_object' },
    });

    const raw = res.choices[0]?.message?.content ?? '{}';
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      this.log.warn('Non-JSON LLM response, falling back');
      data = {};
    }
    const parsed = RiskSchema.safeParse(data);
    if (!parsed.success) {
      this.log.warn(`Invalid schema from LLM: ${parsed.error.message}`);
      // 실패 시 보수적으로 none 처리(운영은 재시도나 키워드 fall-back도 고려)
      return { level: 'none' };
    }
    return parsed.data as { level: RiskLevel; reasons?: string[] };
  }
}
