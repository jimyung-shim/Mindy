export function isValidAnswers(a: unknown): a is number[] {
  return (
    Array.isArray(a) &&
    a.length === 9 &&
    a.every((n) => Number.isInteger(n) && n >= 0 && n <= 3)
  );
}
export const calcTotalScore = (answers: number[]) =>
  answers.reduce((s, n) => s + n, 0);
