export function phq9Severity(total: number): string {
  if (total <= 4) return '없음/최소';
  if (total <= 9) return '경도';
  if (total <= 14) return '중등도';
  if (total <= 19) return '중등도-고도';
  return '고도';
}
