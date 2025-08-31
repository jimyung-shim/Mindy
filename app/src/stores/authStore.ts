import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTokens, clearTokens, loadTokens } from '../services/secure';
import { login as apiLogin } from '../services/api';

type Session = {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  nickname?: string;
};

type AuthState = Session & {
  hydrated: boolean;

  // actions
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (t: { accessToken: string; refreshToken?: string; userId: string }) => Promise<void>;
  setSession: (s: Partial<Pick<AuthState, 'userId' | 'nickname' | 'accessToken' | 'refreshToken'>>) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      // state
      accessToken: undefined,
      refreshToken: undefined,
      userId: undefined,
      nickname: undefined,
      hydrated: false,

      // actions
      setSession: (s) => set(s),

      hydrate: async () => {
        // SecureStore에서 토큰 로드
        const { accessToken, refreshToken, userId } = await loadTokens();
        set({
          accessToken: accessToken ?? undefined,
          refreshToken: refreshToken ?? undefined,
          userId: userId ?? undefined,
          hydrated: true,
        });
      },

      login: async (email, password) => {
        const r = await apiLogin({ email, password });
        const accessToken = String(r.accessToken);
        const refreshToken = r.refreshToken != null ? String(r.refreshToken) : undefined;
        const userId = String(r.userId);
        const nickname = String(r.nickname);

        // 토큰은 SecureStore에만 저장
        await saveTokens({ accessToken, refreshToken, userId });

        // 상태 반영(토큰 + 비민감 정보)
        set({ accessToken, refreshToken, userId, nickname });
      },

      logout: async () => {
        try {
          await clearTokens();
        } finally {
          set({
            accessToken: undefined,
            refreshToken: undefined,
            userId: undefined,
            nickname: undefined,
          });
        }
      },

      setTokens: async (t) => {
        const accessToken = String(t.accessToken);
        const refreshToken = t.refreshToken != null ? String(t.refreshToken) : undefined;
        const userId = String(t.userId);

        await saveTokens({ accessToken, refreshToken, userId });
        set({ accessToken, refreshToken, userId });
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        userId: s.userId,
        nickname: s.nickname,
      }),
    },
  ),
);
