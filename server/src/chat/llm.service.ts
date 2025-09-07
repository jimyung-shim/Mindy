import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  private readonly log = new Logger(LlmService.name);
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async *streamChat(content: string, system?: string, abort?: AbortSignal) {
    // Chat Completions 스트림 (SDK v4 기준)
    const stream = await this.openai.chat.completions.create(
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        stream: true,
        temperature: 0.7,
        messages: [
          ...(system ? [{ role: 'system' as const, content: system }] : []),
          { role: 'user' as const, content },
        ],
      },
      { signal: abort },
    );

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content ?? '';
      if (delta) yield delta;
    }
  }
}
