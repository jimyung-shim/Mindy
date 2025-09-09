import { useAuth } from '../stores/authStore';
import { loadTokens } from './secure';

export async function getAccessToken(): Promise<string> {
  const { accessToken } = useAuth.getState();
  if (accessToken) return accessToken;

  const { accessToken: stored } = await loadTokens();
  if (stored) return stored;

  throw new Error('No access token available');
}
