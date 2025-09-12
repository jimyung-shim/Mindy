export type RiskLevel = 'none' | 'low' | 'moderate' | 'high';

export interface RiskClassification {
  level: RiskLevel;
  // 선택: 판단 근거와 감지된 신호
  reasons?: string[];
}
