export const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);
export const minLen = (v: string, n: number) => v.trim().length >= n;