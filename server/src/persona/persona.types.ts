export type Axis = 'ECONOMY' | 'JOB' | 'RELATION' | 'BODY' | 'FAMILY';

export type PersonaKey =
  | 'HEALTH'
  | 'RELATIONSHIP'
  | 'ECONOMY_JOB'
  | 'LIFE'
  | 'CBT';

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
  HEALTH: '건강',
  RELATIONSHIP: '관계',
  ECONOMY_JOB: '경제/직업',
  LIFE: '생활',
  CBT: '인지행동치료',
};

export type DialogueStyle = 'empathy' | 'solution';
export type ChatAtmosphere = 'calm' | 'bright';
export type CounselingStyle = 'questioning' | 'listening';
