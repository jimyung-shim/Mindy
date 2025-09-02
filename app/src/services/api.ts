import { authedFetch } from './http';
import { CategoryKey } from './persona';

export type AuthResponse = { accessToken: string; refreshToken: string; userId: string, nickname: string };

// 페르소나 배정 응답 형식
export type PersonaAssignResponse = {
  personaKey: string;        // 서버 persona.service.ts에서 반환한 키
  personaLabel: string;      // 한국어 라벨
  reason: string;            // 배정 이유
  imageUrl?: string;         // 서버에서 함께 내려주면 표시 가능
};

// 회원가입
export async function signup(dto: { email: string; password: string; nickname: string }): Promise<any> {
  const res = await authedFetch('/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 로그인
export async function login(dto: { email: string; password: string }): Promise<AuthResponse> {
  const res = await authedFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 내 정보 조회
export async function getMe(): Promise<{ userId: string | null; email: string | null }> {
  const res = await authedFetch('/users/me', { method: 'GET' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 페르소나 배정
export async function assignPersona(categories: CategoryKey[]): Promise<PersonaAssignResponse> {
  const res = await authedFetch('/persona/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}