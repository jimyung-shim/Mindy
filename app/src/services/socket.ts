import { io, Socket } from 'socket.io-client';
import { SERVER_URL } from '@env';
import { getAccessToken } from './auth';
import { toWsUrl } from '../utils/url';

let socket: Socket | null = null;

type Options = { onReconnect?: () => void };

// export async function getSocket(opts?: Options): Promise<Socket> {
//   if (socket && socket.connected) return socket;

//   const token = await getAccessToken();
//   socket = io(SERVER_URL, {
//     transports: ['websocket'],
//     auth: { token },                 // 서버 WsJwtGuard가 읽는 위치
//     reconnection: true,
//     reconnectionAttempts: 10,
//     reconnectionDelay: 800,
//   });

//   socket.io.on('reconnect', () => {
//     opts?.onReconnect?.();
//   });

//   return socket;
// }

export function getSocket(): Socket | null {
  return socket;
}

export function initializeSocket(token: string, userId: string): void {
  if (socket?.connected) {
    return;
  }
  if (socket) {
    socket.disconnect();
  }

  const wsBase = toWsUrl(SERVER_URL);
  socket = io(wsBase, {
    transports: ['websocket'],
    auth: { token },
    forceNew: true,
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected. Emitting join room event for:', `user:${userId}`);
    socket?.emit('join', { room: `user:${userId}` });
  });
}

export function initSocket(token: string): Socket {
  try { socket?.disconnect(); } catch {}
  socket = null;

  const wsBase = toWsUrl(SERVER_URL);
  socket = io(wsBase, {
    transports: ['websocket'],
    auth: { token },                                // WsJwtGuard(auth.token) 대응
    extraHeaders: { Authorization: `Bearer ${token}` }, // 헤더 기반 인증 대응
    forceNew: true,
    reconnection: true,
  });
  return socket;
}

// export async function joinUserRoom(userId: string): Promise<void> {
//   const s = await getSocket();
//   s.emit('join', { room: `user:${userId}` });
// }

type PromptPayload = { conversationId: string; reason: 'risk'|'turns'; draftId: string };

export function onSurveyPrompt(handler: (p: PromptPayload) => void) {
  socket?.on('survey:prompt', handler);
}

export function offSurveyPrompt(handler: (p: PromptPayload) => void) {
  socket?.off('survey:prompt', handler);
}