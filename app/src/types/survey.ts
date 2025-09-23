export type SurveyStatus = "draft" | "submitted";
export type SurveyReason = "risk" | "turns";

// 단일 검사 결과 타입
type SurveyResult = {
  _id: string;
  answers: number[];
  totalScore: number;
};

export type SurveyDraftResponse = {
  id: string;
  status: SurveyStatus;
  conversationId: string;
  answers?: number[];
  summary?: string;
};

export type SurveySubmitResponse = {
  id: string;
  status: "submitted";
  totalScore: number;
  submittedAt: string;
};

export type SurveyMineItem = {
  id: string;
  status: SurveyStatus;
  totalScore: number;
  createdAt: string;
  submittedAt?: string;
  reason: SurveyReason;
};

export type CbtAnalysis = {
  situation: string;
  emotion: { name: string; intensity: number };
  automaticThought: string;
  supportingEvidence: string[];
  counterEvidence: string[];
  alternativeThoughts: string[];
  emotionAfterAlternative: { name: string; intensity: number };
};

export type SurveyDetail = {
  id: string;
  conversationId: string;
  status: SurveyStatus | string;
  summary: string;
  reason: SurveyReason | string;
  createdAt: string;
  submittedAt?: string;
  phq9?: SurveyResult;
  gad7?: SurveyResult;
  pss?: SurveyResult;
  cbt?: CbtAnalysis;
};
