import { SERVER_URL } from '@env';
import { useAuth } from '../stores/authStore';

const base = (SERVER_URL?.replace(/\/$/, '') ?? 'http://localhost:3000') as string;

export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const state = useAuth.getState();
  const headers = new Headers(init.headers ?? {});
  if (state.accessToken) headers.set('Authorization', `Bearer ${state.accessToken}`);

  const res = await fetch(base + path, { ...init, headers });

  if (res.status === 401) {
    // Access Token 만료 → 그냥 로그아웃 시킴
    await useAuth.getState().logout();
  }

  return res;
}