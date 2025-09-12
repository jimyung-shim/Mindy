import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { DialogueStyle } from 'src/persona/persona.types';

@Injectable()
export class LlmService {
  private readonly log = new Logger(LlmService.name);
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async *streamChat(
    content: string,
    system?: string,
    dialogueStyle?: DialogueStyle,
    abort?: AbortSignal,
  ) {
    let finalSystemPrompt = system ?? '';

    // [!] dialogueStyle에 따라 프롬프트에 동적으로 지시사항 추가
    if (dialogueStyle === 'empathy') {
      finalSystemPrompt +=
        '\n\n[추가 지시]\n- 사용자의 감정을 깊이 공감하고 위로하는 데 집중하세요. 해결책을 제시하기보다는 감정을 되돌아보고 수용할 수 있도록 도와주세요.';
    } else if (dialogueStyle === 'solution') {
      finalSystemPrompt +=
        '\n\n[추가 지시]\n- 사용자의 문제 상황을 명확히 파악하고, 실질적이고 현실적인 해결책이나 대안을 1~2가지 제안하는 데 집중하세요.';
    }

    // Chat Completions 스트림 (SDK v4 기준)
    const stream = await this.openai.chat.completions.create(
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        stream: true,
        messages: [
          ...(finalSystemPrompt
            ? [{ role: 'system' as const, content: finalSystemPrompt }]
            : []),
          { role: 'user' as const, content },
        ],
        //max_completion_tokens: 800,
      },
      { signal: abort },
    );

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content ?? '';
      if (delta) yield delta;
    }
  }

  async getChatCompletion(content: string, system?: string): Promise<string> {
    const res = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        ...(system ? [{ role: 'system' as const, content: system }] : []),
        { role: 'user' as const, content },
      ],
      response_format: { type: 'json_object' },
    });
    return res.choices[0]?.message?.content ?? '{}';
  }
}
