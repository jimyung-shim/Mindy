import { authedFetch } from './http';

export type AuthResponse = { accessToken: string; refreshToken: string; userId: string, nickname: string };

export async function signup(dto: { email: string; password: string; nickname: string }): Promise<any> {
  const res = await authedFetch('/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(dto: { email: string; password: string }): Promise<AuthResponse> {
  const res = await authedFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
