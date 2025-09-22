import { Injectable } from '@nestjs/common';
import type { CategoryKey, PersonaKey } from './persona.types';
import { personaLabelKorean } from './persona.types';
import { getSystemPromptForPersona } from './personaPrompts';

const categoryToPersonaMap: Record<CategoryKey, PersonaKey> = {
  // 건강
  MENTAL_HEALTH: 'HEALTH',
  PHYSICAL_HEALTH: 'HEALTH',
  APPEARANCE: 'HEALTH',

  // 관계
  FAMILY: 'RELATIONSHIP',
  BREAKUP_DIVORCE: 'RELATIONSHIP',
  MARRIAGE: 'RELATIONSHIP',
  RELATION_BULLYING: 'RELATIONSHIP',
  PET_LOSS: 'RELATIONSHIP',
  ROMANCE: 'RELATIONSHIP',
  PARENTING: 'RELATIONSHIP',

  // 경제/직업
  WORKPLACE: 'ECONOMY_JOB',
  STUDY: 'ECONOMY_JOB',
  FINANCE_BUSINESS: 'ECONOMY_JOB',
  CAREER: 'ECONOMY_JOB',

  // 생활
  SELF_PERSONALITY: 'LIFE',
  SEX_CRIME: 'LIFE',
  SEX_LIFE: 'LIFE',
  LGBT: 'LIFE',
};

export type AssignResult = {
  personaKey: PersonaKey;
  personaLabel: string;
  reason: string;
};

@Injectable()
export class PersonaService {
  assign(categories: CategoryKey[]): AssignResult {
    if (!categories || categories.length === 0) {
      // 선택된 카테고리가 없을 경우 기본 페르소나 '관계' 배정
      return {
        personaKey: 'RELATIONSHIP',
        personaLabel: personaLabelKorean.RELATIONSHIP,
        reason: '상담할 주제를 선택하여 더 꼭 맞는 상담사를 만나보세요.',
      };
    }

    const scores: Record<PersonaKey, number> = {
      HEALTH: 0,
      RELATIONSHIP: 0,
      ECONOMY_JOB: 0,
      LIFE: 0,
      CBT: 0,
    };

    for (const category of categories) {
      const persona = categoryToPersonaMap[category];
      if (persona) {
        scores[persona]++;
      }
    }

    // 가장 높은 점수를 받은 페르소나를 찾음
    let highestScore = -1;
    let finalPersonaKey: PersonaKey = 'RELATIONSHIP'; // 기본값

    // 점수가 높은 순으로 정렬하여 동점일 경우 우선순위(아래 배열 순서)를 가짐
    const sortedPersonas = Object.entries(scores).sort(([, a], [, b]) => b - a);

    if (sortedPersonas.length > 0 && sortedPersonas[0][1] > 0) {
      finalPersonaKey = sortedPersonas[0][0] as PersonaKey;
    }

    const label = personaLabelKorean[finalPersonaKey];
    const reason = `선택하신 고민들을 바탕으로 '${label}' 페르소나를 배정해 드렸어요.`;

    return { personaKey: finalPersonaKey, personaLabel: label, reason };
  }

  getSystemPrompt(key?: PersonaKey | null): string {
    return getSystemPromptForPersona(key);
  }
}
