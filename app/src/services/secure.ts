import * as SecureStore from 'expo-secure-store';
const K = { access: 'accessToken', refresh: 'refreshToken', userId: 'userId' } as const;

export async function saveTokens(t: { 
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  userId: string | null | undefined;
}) {

  if (!t?.accessToken) throw new Error('accessToken is required');
  if (t.userId == null) throw new Error('userId is required');

  await SecureStore.setItemAsync(K.access, String(t.accessToken));
  await SecureStore.setItemAsync(K.userId, String(t.userId));

  if (t.refreshToken != null) {
    await SecureStore.setItemAsync(K.refresh, String(t.refreshToken));
  }

}
export async function loadTokens() {
  const [accessToken, refreshToken, userId] = await Promise.all([
    SecureStore.getItemAsync(K.access),
    SecureStore.getItemAsync(K.refresh),
    SecureStore.getItemAsync(K.userId),
  ]);
  return { accessToken, refreshToken, userId };
}
export async function clearTokens() {
  await Promise.all([
    await SecureStore.deleteItemAsync(K.access),
    await SecureStore.deleteItemAsync(K.refresh),
    await SecureStore.deleteItemAsync(K.userId),
  ]);
}
