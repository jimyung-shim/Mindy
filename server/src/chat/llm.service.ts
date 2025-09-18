import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import {
  DialogueStyle,
  ChatAtmosphere,
  CounselingStyle,
} from 'src/persona/persona.types';

@Injectable()
export class LlmService {
  private readonly log = new Logger(LlmService.name);
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async *streamChat(
    content: string,
    system?: string,
    dialogueStyle?: DialogueStyle,
    chatAtmosphere?: ChatAtmosphere,
    counselingStyle?: CounselingStyle,
    abort?: AbortSignal,
  ) {
    let finalSystemPrompt = system ?? '';
    const extraInstructions: string[] = [];

    // 각 옵션에 따라 프롬프트에 동적으로 지시사항 추가
    if (dialogueStyle === 'empathy') {
      extraInstructions.push(
        '- 사용자의 감정을 깊이 공감하고 위로하는 데 집중하세요. 해결책을 제시하기보다는 감정을 되돌아보고 수용할 수 있도록 도와주세요.',
      );
    } else if (dialogueStyle === 'solution') {
      extraInstructions.push(
        '- 사용자의 문제 상황을 명확히 파악하고, 실질적이고 현실적인 해결책이나 대안을 1~2가지 제안하는 데 집중하세요.',
      );
    }

    if (chatAtmosphere === 'calm') {
      extraInstructions.push(
        '- 차분하고 안정적인 분위기를 조성하며, 신중하고 부드러운 단어를 선택해 대화하세요.',
      );
    } else if (chatAtmosphere === 'bright') {
      extraInstructions.push(
        '- 긍정적이고 활기찬 에너지를 전달하며, 희망을 주는 표현과 이모티콘(😊,👍)을 적절히 사용해 밝은 분위기를 만드세요.',
      );
    }

    if (counselingStyle === 'questioning') {
      extraInstructions.push(
        '- 사용자가 자신의 생각과 감정을 더 깊이 탐색할 수 있도록 개방형 질문을 자주 사용하세요.',
      );
    } else if (counselingStyle === 'listening') {
      extraInstructions.push(
        '- 사용자의 말을 중간에 끊지 않고 끝까지 경청하는 태도를 보여주며, 사용자의 말을 요약하고 반복하며 이해했음을 표현해주세요.',
      );
    }

    if (extraInstructions.length > 0) {
      finalSystemPrompt +=
        '\n\n[추가 대화 지침]\n' + extraInstructions.join('\n');
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
