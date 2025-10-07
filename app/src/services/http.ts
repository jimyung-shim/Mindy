import { SERVER_URL } from '@env';
import { useAuth } from '../stores/authStore';
import { saveTokens, loadTokens } from './secure';
import { Alert } from 'react-native';



const base = (SERVER_URL?.replace(/\/$/, '') ?? 'http://localhost:3000') as string;

// 중앙 API 에러 핸들러
function handleApiError(error: Error) {
  console.error("API Error:", error);
  Alert.alert('오류', error.message ?? '알 수 없는 오류가 발생했습니다.');
}

// 1. 인증이 필요 없는 요청을 위한 객체
const http = {
  get: async <T>(path: string): Promise<{ data: T }> => {
    try {
      const response = await fetch(base + path);
      if (!response.ok) throw new Error(await response.text());
      const data: T = await response.json();
      return { data };
    } catch (e: any) {
      handleApiError(e);
      throw e;
    }
  },
  post: async <T>(path: string, body: unknown): Promise<{ data: T }> => {
    try {
      const response = await fetch(base + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(await response.text());
      const data: T = await response.json();
      return { data };
    } catch (e: any) {
      handleApiError(e);
      throw e;
    }
  },
};

let refreshing: Promise<void> | null = null;

async function refreshOnce() {
  if (!refreshing) {
    refreshing = (async () => {
      const { userId, refreshToken } = await loadTokens();
      if (!userId || !refreshToken) {
        useAuth.getState().logout();
        throw new Error('No refresh token');
      }

      const res = await fetch(base + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, refreshToken }),
      });
      if (!res.ok) {
        useAuth.getState().logout();
        throw new Error(await res.text());
      }

      const data = (await res.json());
      await saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
      });
      useAuth.getState().setSession(data);
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

// 2. 인증이 필요한 GET 요청 (기존 함수)
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const doFetch = (token?: string | null) => {
    const headers = new Headers(init.headers ?? {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(base + path, { ...init, headers });
  };

  try {
    const { accessToken } = useAuth.getState();
    let res = await doFetch(accessToken);

    if (res.status !== 401) {
      if (!res.ok) throw new Error(await res.text());
      return res;
    }

    await refreshOnce();
    const { accessToken: newAccessToken } = useAuth.getState();
    res = await doFetch(newAccessToken);
    
    if (!res.ok) throw new Error(await res.text());
    return res;
  } catch (e: any) {
    handleApiError(e);
    throw e;
  }
}

// 3. 인증이 필요한 POST 요청 (새로 추가한 함수)
export async function authedPost<T>(path: string, body: unknown): Promise<{ data: T }> {
  const response = await authedFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data: T = await response.json();
  return { data };
}

// 4. 모든 기능을 export 합니다.
export { http };