import { SERVER_URL } from '@env';

const base = SERVER_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export type AuthResponse = { accessToken: string; refreshToken?: string };

export async function signup(dto: { email: string; password: string; nickname: string }): Promise<AuthResponse> {
  const res = await fetch(`${base}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(dto: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${base}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}