import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity, Text } from 'react-native';
import { getSocket } from '../../services/socket';
import { useChatStore } from '../../stores/chatStore';
import * as Crypto from 'expo-crypto';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Chat'>;

export default function ChatScreen({ route }: Props) {
  const { conversationId } = route.params;
  const { messagesByConv, pushMessage, upsertStreamingAssistant, endStreamingAssistant } = useChatStore();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);
  const messages = messagesByConv[conversationId] ?? [];

  useEffect(() => {
    let mounted = true;

    (async () => {
      const socket = await getSocket({
        onReconnect: () => {
          // 필요 시 재조인/재동기
        },
      });

      // (선택) 진입 시 대화방 open (서버는 멱등/무해)
      socket.emit('conversation:open', {});

      const onAck = (_: any) => {};
      const onStream = (payload: any) => {
        if (!mounted || payload.conversationId !== conversationId) return;
        upsertStreamingAssistant(conversationId, payload.delta ?? '');
        listRef.current?.scrollToEnd({ animated: true });
      };
      const onComplete = (payload: any) => {
        if (!mounted || payload.conversationId !== conversationId) return;
        endStreamingAssistant(conversationId, payload.text ?? '');
        setSending(false);
        listRef.current?.scrollToEnd({ animated: true });
      };
      const onError = (payload: any) => {
        if (!mounted || payload.conversationId !== conversationId) return;
        setSending(false);
        // TODO: 토스트
      };

      socket.on('message:ack', onAck);
      socket.on('message:stream', onStream);
      socket.on('message:complete', onComplete);
      socket.on('message:error', onError);

      return () => {
        mounted = false;
        socket.off('message:ack', onAck);
        socket.off('message:stream', onStream);
        socket.off('message:complete', onComplete);
        socket.off('message:error', onError);
      };
    })();
  }, [conversationId, upsertStreamingAssistant, endStreamingAssistant]);

  async function send() {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    // 낙관적 유저 메시지
    pushMessage(conversationId, { role: 'user', text, localOnly: true });

    const socket = await getSocket();
    const clientMsgId = await Crypto.randomUUID();
    socket.emit('message:create', { conversationId, clientMsgId, text });
  }

  async function cancel() {
    const socket = await getSocket();
    socket.emit('message:cancel', { conversationId });
  }

  const renderItem = ({ item }: any) => (
    <View style={{
      alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
      backgroundColor: item.role === 'user' ? '#111827' : '#e5e7eb',
      padding: 10, borderRadius: 10, marginVertical: 4, maxWidth: '85%'
    }}>
      <Text style={{ color: item.role === 'user' ? 'white' : '#111' }}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <FlatList
        ref={listRef}
        style={{ flex: 1, padding: 16 }}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={{ flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', marginBottom: 60 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}
          multiline
        />
        <TouchableOpacity onPress={send} disabled={sending} style={{ paddingHorizontal: 14, justifyContent: 'center' }}>
          <Text style={{ fontWeight: '700', color: sending ? '#9ca3af' : '#111' }}>보내기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancel} style={{ paddingHorizontal: 10, justifyContent: 'center' }}>
          <Text style={{ color: '#ef4444' }}>Stop</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
