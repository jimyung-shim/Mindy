import { SERVER_URL } from '@env';
import { useAuth } from '../stores/authStore';
import { saveTokens, loadTokens } from './secure';

const base = (SERVER_URL?.replace(/\/$/, '') ?? 'http://localhost:3000') as string;

let refreshing: Promise<void> | null = null;

async function refreshOnce() {
  if (!refreshing) {
    refreshing = (async () => {
      const { userId, refreshToken } = await loadTokens();
      if (!userId || !refreshToken) throw new Error('No refresh token');

      const res = await fetch(base + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, refreshToken }),
      });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      await saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
      });
      useAuth.setState({
        accessToken: String(data.accessToken),
        refreshToken: String(data.refreshToken),
        userId: String(data.userId),
        nickname: String(data.nickname),
      });
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const state = useAuth.getState();
  const headers = new Headers(init.headers ?? {});
  if (state.accessToken) headers.set('Authorization', `Bearer ${state.accessToken}`);

const doFetch = () => fetch(base + path, { ...init, headers });

  let res = await doFetch();
  if (res.status !== 401) return res;

  // 401 → refresh → 재시도(1회)
  try {
    await refreshOnce();
    const newHeaders = new Headers(init.headers ?? {});
    const { accessToken } = useAuth.getState();
    if (accessToken) newHeaders.set('Authorization', `Bearer ${accessToken}`);
    res = await fetch(base + path, { ...init, headers: newHeaders });
    return res;
  } catch {
    await useAuth.getState().logout();
    return res; // 원 응답 반환(호출부에서 처리)
  }
}