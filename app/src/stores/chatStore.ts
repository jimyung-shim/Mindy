import { create } from 'zustand';

export type Role = 'user' | 'assistant' | 'system' | 'tool';

export type ChatMessage = {
  _id?: string;
  role: Role;
  text: string;
  createdAt?: string;
  seq?: number;
  localOnly?: boolean; // 스트리밍/낙관적 상태
};

type ConversationState = {
  conversations: Array<{ _id: string; lastMessageAt: string; messageCount: number }>;
  messagesByConv: Record<string, ChatMessage[]>;
  typingByConv: Record<string, boolean>;
  setConversations: (items: ConversationState['conversations']) => void;
  pushMessage: (conversationId: string, msg: ChatMessage) => void;
  upsertStreamingAssistant: (conversationId: string, textDelta: string) => void;
  endStreamingAssistant: (conversationId: string, textFinal: string) => void;
  setTyping: (conversationId: string, on: boolean) => void;
  resetConv: (conversationId: string) => void;
};

export const useChatStore = create<ConversationState>((set, get) => ({
  conversations: [],
  messagesByConv: {},
  typingByConv: {},

  setConversations(items) {
    set({ conversations: items });
  },

  pushMessage(conversationId, msg) {
    const map = { ...get().messagesByConv };
    const arr = map[conversationId] ? [...map[conversationId]] : [];
    arr.push(msg);
    map[conversationId] = arr;
    set({ messagesByConv: map });
  },

  upsertStreamingAssistant(conversationId, textDelta) {
    const map = { ...get().messagesByConv };
    const arr = map[conversationId] ? [...map[conversationId]] : [];
    if (arr.length && arr[arr.length - 1].role === 'assistant' && arr[arr.length - 1].localOnly) {
      arr[arr.length - 1] = {
        ...arr[arr.length - 1],
        text: (arr[arr.length - 1].text ?? '') + textDelta,
      };
    } else {
      arr.push({ role: 'assistant', text: textDelta, localOnly: true });
    }
    map[conversationId] = arr;
    set({ messagesByConv: map });
  },

  endStreamingAssistant(conversationId, textFinal) {
    const map = { ...get().messagesByConv };
    const arr = map[conversationId] ? [...map[conversationId]] : [];
    if (arr.length && arr[arr.length - 1].role === 'assistant' && arr[arr.length - 1].localOnly) {
      arr[arr.length - 1] = { ...arr[arr.length - 1], text: textFinal, localOnly: false };
    } else {
      arr.push({ role: 'assistant', text: textFinal, localOnly: false });
    }
    map[conversationId] = arr;
    set({ messagesByConv: map });
  },

  setTyping(conversationId, on) {
    set({ typingByConv: { ...get().typingByConv, [conversationId]: on } });
  },

  resetConv(conversationId) {
    const map = { ...get().messagesByConv };
    delete map[conversationId];
    set({ messagesByConv: map });
  },
}));
