import { Injectable } from '@nestjs/common';
import type { Axis, CategoryKey, PersonaKey } from './persona.types';
import { personaLabelKorean } from './persona.types';

const MAP: Record<CategoryKey, [Axis, number][]> = {
  RELATION_BULLYING: [['RELATION', 3]],
  SELF_PERSONALITY: [['RELATION', 2]],
  MENTAL_HEALTH: [['RELATION', 2]],
  FAMILY: [
    ['FAMILY', 3],
    ['RELATION', 1],
  ],
  WORKPLACE: [
    ['JOB', 2],
    ['RELATION', 1],
  ],
  PARENTING: [['FAMILY', 2]],
  CAREER: [
    ['JOB', 3],
    ['ECONOMY', 1],
  ],
  ROMANCE: [['RELATION', 2]],
  BREAKUP_DIVORCE: [
    ['RELATION', 2],
    ['FAMILY', 1],
  ],
  STUDY: [['JOB', 2]],
  MARRIAGE: [
    ['FAMILY', 2],
    ['RELATION', 1],
  ],
  LGBT: [['RELATION', 2]],
  PHYSICAL_HEALTH: [['BODY', 3]],
  SEX_CRIME: [
    ['RELATION', 2],
    ['BODY', 2],
  ],
  APPEARANCE: [
    ['RELATION', 1],
    ['BODY', 1],
  ],
  SEX_LIFE: [
    ['BODY', 2],
    ['RELATION', 1],
  ],
  FINANCE_BUSINESS: [
    ['ECONOMY', 3],
    ['JOB', 1],
  ],
  PET_LOSS: [
    ['FAMILY', 2],
    ['RELATION', 1],
  ],
};

const SINGLE: Record<Axis, PersonaKey> = {
  ECONOMY: 'ECONOMY',
  JOB: 'JOB',
  RELATION: 'RELATION',
  BODY: 'BODY',
  FAMILY: 'FAMILY',
};

const ALL_PAIRS: PersonaKey[] = [
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

const toPairKey = (a: Axis, b: Axis): PersonaKey | null => {
  const [x, y] = [a, b].sort() as [Axis, Axis];
  const k = `${x}+${y}` as PersonaKey;
  return ALL_PAIRS.includes(k) ? k : null;
};

export type AssignResult = {
  personaKey: PersonaKey;
  personaLabel: string;
  reason: string;
};

@Injectable()
export class PersonaService {
  assign(categories: CategoryKey[]): AssignResult {
    const score = new Map<Axis, number>([
      ['ECONOMY', 0],
      ['JOB', 0],
      ['RELATION', 0],
      ['BODY', 0],
      ['FAMILY', 0],
    ]);
    for (const c of categories)
      for (const [axis, w] of MAP[c] ?? [])
        score.set(axis, (score.get(axis) ?? 0) + w);

    const ranked = [...score.entries()]
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1]);
    const [t1, t2] = [ranked[0], ranked[1]];

    let personaKey: PersonaKey;
    if (t1 && t2 && t2[1] > 0 && !(t2[1] * 2 <= t1[1])) {
      personaKey = toPairKey(t1[0], t2[0]) ?? SINGLE[t1[0]];
    } else if (t1) {
      personaKey = SINGLE[t1[0]];
    } else {
      personaKey = 'RELATION';
    }

    const label = personaLabelKorean[personaKey];
    const reason = personaKey.includes('+')
      ? `선택 항목이 ${label} 축에 고르게 분포하여 조합형을 배정했어요.`
      : `선택 항목이 '${label}' 축에 가장 강하게 모여 단일형을 배정했어요.`;
    return { personaKey, personaLabel: label, reason };
  }
}
