import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('유효한 이메일을 입력하세요'),
    password: z.string().min(8, '비밀번호는 8자 이상'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
    email: z.string().email('유효한 이메일을 입력하세요'),
    nickname: z.string().min(2, '닉네임은 2자 이상'),
    password: z.string().min(8, '비밀번호는 8자 이상'),
    confirm: z.string(),
}).refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: '비밀번호가 일치하지 않습니다',
});

export type SignupInput = z.infer<typeof signupSchema>;