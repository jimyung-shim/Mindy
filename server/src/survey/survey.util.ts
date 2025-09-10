export const PHQ9_QUESTIONS = [
  '일을 하는 것에 대한 흥미나 재미가 거의 없음',
  '가라앉은 느낌, 우울감 혹은 절망감',
  '잠들기 어렵거나 자꾸 깨어남, 혹은 너무 많이 잠',
  '피곤함, 기력 저하',
  '식욕 저하 혹은 과식',
  '내 자신이 나쁜 사람이라는 느낌, 혹은 실패자라고 느낌',
  '신문을 읽거나 TV를 볼 때 집중하기 어려움',
  '말이 느려지거나 반대로 초조하고 안절부절 못함',
  '차라리 죽는 것이 낫겠다는 생각 혹은 자해 충동',
];

export function isValidAnswers(a: unknown): a is number[] {
  return (
    Array.isArray(a) &&
    a.length === 9 &&
    a.every((n) => Number.isInteger(n) && n >= 0 && n <= 3)
  );
}
export const calcTotalScore = (answers: number[]) =>
  answers.reduce((s, n) => s + n, 0);
