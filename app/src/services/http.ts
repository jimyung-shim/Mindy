import { SERVER_URL } from '@env';
import { useAuth } from '../stores/authStore';
import { saveTokens, loadTokens } from './secure';
import { Alert } from 'react-native';

const base = (SERVER_URL?.replace(/\/$/, '') ?? 'http://localhost:3000') as string;

let refreshing: Promise<void> | null = null;

// 중앙 API 에러 핸들러
function handleApiError(error: Error) {
  // 실제 운영 앱에서는 Sentry같은 로깅 서비스에 에러를 전송할 수 있습니다.
  console.error("API Error:", error);
  // 사용자에게 표시되는 Alert
  Alert.alert('오류', error.message ?? '알 수 없는 오류가 발생했습니다.');
}

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
  const doFetch = (token?: string) => {
    const headers = new Headers(init.headers ?? {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(base + path, { ...init, headers });
  };

  try {
    const state = useAuth.getState();
    let res = await doFetch(state.accessToken);

    if (res.status !== 401) {
      if (!res.ok) throw new Error(await res.text()); // 401이 아닌 다른 에러 처리
      return res;
    }

    // 401 에러 시 토큰 갱신
    await refreshOnce();
    const { accessToken: newAccessToken } = useAuth.getState();
    res = await doFetch(newAccessToken);
    
    if (!res.ok) throw new Error(await res.text()); // 갱신 후 재시도 실패 시 에러 처리
    return res;

  } catch (e: any) {
    handleApiError(e); // 중앙 에러 핸들러 호출
    throw e; // 에러를 다시 던져서 각 컴포넌트의 .catch 또는 finally 블록이 실행되도록 함
  }
}