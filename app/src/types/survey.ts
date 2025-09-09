export type SurveyStatus = 'draft' | 'submitted';
export type SurveyReason = 'risk' | 'turns';

export type SurveyDraftResponse = {
  id: string;
  status: SurveyStatus;
  conversationId: string;
  answers?: number[];
  summary?: string;
};

export type SurveySubmitResponse = {
  id: string;
  status: 'submitted';
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

export type SurveyDetail = {
  id: string;
  conversationId: string;
  status: SurveyStatus | string;
  answers?: number[];
  totalScore: number;
  summary: string;
  reason: SurveyReason | string;
};
