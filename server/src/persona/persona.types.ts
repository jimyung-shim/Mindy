export type Axis = 'ECONOMY' | 'JOB' | 'RELATION' | 'BODY' | 'FAMILY';

export type PersonaKey =
  | 'ECONOMY'
  | 'JOB'
  | 'RELATION'
  | 'BODY'
  | 'FAMILY'
  | 'ECONOMY+JOB'
  | 'ECONOMY+RELATION'
  | 'ECONOMY+BODY'
  | 'ECONOMY+FAMILY'
  | 'JOB+RELATION'
  | 'JOB+BODY'
  | 'JOB+FAMILY'
  | 'RELATION+BODY'
  | 'RELATION+FAMILY'
  | 'BODY+FAMILY';

export type CategoryKey =
  | 'RELATION_BULLYING'
  | 'SELF_PERSONALITY'
  | 'MENTAL_HEALTH'
  | 'FAMILY'
  | 'WORKPLACE'
  | 'PARENTING'
  | 'CAREER'
  | 'ROMANCE'
  | 'BREAKUP_DIVORCE'
  | 'STUDY'
  | 'MARRIAGE'
  | 'LGBT'
  | 'PHYSICAL_HEALTH'
  | 'SEX_CRIME'
  | 'APPEARANCE'
  | 'SEX_LIFE'
  | 'FINANCE_BUSINESS'
  | 'PET_LOSS';

// 파일 상단/하단 어디든 추가
export const CATEGORY_KEYS = [
  'RELATION_BULLYING',
  'SELF_PERSONALITY',
  'MENTAL_HEALTH',
  'FAMILY',
  'WORKPLACE',
  'PARENTING',
  'CAREER',
  'ROMANCE',
  'BREAKUP_DIVORCE',
  'STUDY',
  'MARRIAGE',
  'LGBT',
  'PHYSICAL_HEALTH',
  'SEX_CRIME',
  'APPEARANCE',
  'SEX_LIFE',
  'FINANCE_BUSINESS',
  'PET_LOSS',
] as const;

export const personaLabelKorean: Record<PersonaKey, string> = {
  ECONOMY: '경제',
  JOB: '직업',
  RELATION: '대인 관계',
  BODY: '신체 문제',
  FAMILY: '가족 문제',
  'ECONOMY+JOB': '경제 + 직업',
  'ECONOMY+RELATION': '경제 + 대인 관계',
  'ECONOMY+BODY': '경제 + 신체 문제',
  'ECONOMY+FAMILY': '경제 + 가족 문제',
  'JOB+RELATION': '직업 + 대인 관계',
  'JOB+BODY': '직업 + 신체 문제',
  'JOB+FAMILY': '직업 + 가족 문제',
  'RELATION+BODY': '대인 관계 + 신체 문제',
  'RELATION+FAMILY': '대인 관계 + 가족 문제',
  'BODY+FAMILY': '신체 문제 + 가족 문제',
};

export type DialogueStyle = 'empathy' | 'solution';
