export const CATEGORIES = [
    { key:'RELATION_BULLYING', label:'대인관계/따돌림' },
    { key:'SELF_PERSONALITY',  label:'자아/성격' },
    { key:'MENTAL_HEALTH',     label:'정신건강' },
    { key:'FAMILY',            label:'가족' },
    { key:'WORKPLACE',         label:'직장' },
    { key:'PARENTING',         label:'육아/출산' },
    { key:'CAREER',            label:'취업/진로' },
    { key:'ROMANCE',           label:'연애' },
    { key:'BREAKUP_DIVORCE',   label:'이별/이혼' },
    { key:'STUDY',             label:'학업/고시' },
    { key:'MARRIAGE',          label:'부부관계' },
    { key:'LGBT',              label:'LGBT' },
    { key:'PHYSICAL_HEALTH',   label:'신체건강' },
    { key:'SEX_CRIME',         label:'성범죄' },
    { key:'APPEARANCE',        label:'외모' },
    { key:'SEX_LIFE',          label:'성생활' },
    { key:'FINANCE_BUSINESS',  label:'금전/사업' },
    { key:'PET_LOSS',          label:'펫로스' },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];
