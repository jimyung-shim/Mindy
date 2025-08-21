import { create } from 'zustand';
import { saveTokens, clearTokens, loadTokens } from '../services/secure';
import { login as apiLogin } from '../services/api';

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  nickname?: string;
  hydrated: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  hydrate(): Promise<void>;
  setTokens(t: { accessToken: string; refreshToken: string; userId: string, nickname: string }): Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  hydrated: false,
  async login(email, password) {
    const r = await apiLogin({ email, password });
    // 백엔드 응답을 문자열로 강제 변환해 저장 (undefined 방지)
    const accessToken = String(r.accessToken);
    const refreshToken = r.refreshToken != null ? String(r.refreshToken) : undefined;
    const userId = String(r.userId); // 서버 쪽 필드명에 맞게
    const nickname = String(r.nickname);

    await saveTokens({ accessToken, refreshToken, userId });
    set({ accessToken, refreshToken, userId, nickname });
  },

  async logout() {
    await clearTokens();
    set({ accessToken: undefined, refreshToken: undefined, userId: undefined });
  },

  async hydrate() {
    const t = await loadTokens();
    set({ ...t, hydrated: true } as any);
  },

  async setTokens(t) {
    const accessToken = String(t.accessToken);
    const refreshToken = t.refreshToken != null ? String(t.refreshToken) : undefined;
    const userId = String(t.userId);
    await saveTokens({ accessToken, refreshToken, userId });
    set({ accessToken, refreshToken, userId });
  },
}));
