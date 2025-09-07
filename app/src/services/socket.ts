import { io, Socket } from 'socket.io-client';
import { SERVER_URL } from '@env';
import { getAccessToken } from './auth';

let socket: Socket | null = null;

type Options = { onReconnect?: () => void };

export async function getSocket(opts?: Options): Promise<Socket> {
  if (socket && socket.connected) return socket;

  const token = await getAccessToken();
  socket = io(SERVER_URL, {
    transports: ['websocket'],
    auth: { token },                 // 서버 WsJwtGuard가 읽는 위치
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 800,
  });

  socket.io.on('reconnect', () => {
    opts?.onReconnect?.();
  });

  return socket;
}
