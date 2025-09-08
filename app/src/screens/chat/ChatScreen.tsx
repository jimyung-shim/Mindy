import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView,
  Platform, FlatList, TouchableOpacity,
  Text, Alert, Image, Keyboard, SafeAreaView, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Crypto from 'expo-crypto';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getSocket } from '../../services/socket';
import { useChatStore } from '../../stores/chatStore';
import type { AppStackParamList } from '../../navigation/types';
import { getMessages } from '../../services/api';
import { colors } from '../../theme/colors';
import { usePersona } from '../../stores/personaStore';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInputBar from '../../components/chat/ChatInputBar';

type Props = NativeStackScreenProps<AppStackParamList, 'Chat'>;

export default function ChatScreen({ route }: Props) {
  const { conversationId } = route.params;
  const {
    messagesByConv,
    pushMessage,
    upsertStreamingAssistant,
    endStreamingAssistant,
    setMessagesForConv,
    renameConversation
  } = useChatStore();
  const { imageUrl: botAvatarUrl } = usePersona(); // 선택된 페르소나 아바타
  const userAvatar = undefined; // 사용자 프로필 URL이 있으면 여기에 할당
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);
  const messages = messagesByConv[conversationId] ?? [];
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  useEffect(() => {
    let mounted = true;
    let socket: Awaited<ReturnType<typeof getSocket>> | null = null; 

    async function loadHistory() {
      if (conversationId === 'new' || !mounted) return;
      try {
        const messages = await getMessages(conversationId);
        if (mounted) {
          setMessagesForConv(conversationId, messages);
        }
      } catch (e) {
        console.error('Failed to load message history', e);
        Alert.alert('오류', '이전 대화 내역을 불러오지 못했습니다.');
      }
    }

    loadHistory(); 

    (async () => {
      socket = await getSocket({
        onReconnect: () => {
          // 필요 시 재조인/재동기
        },
      });

      const onCreated = (payload: { tempId: string; newId: string }) => {
        if (!mounted) return;
        // 스토어의 임시 ID('new')를 실제 ID로 변경합니다.
        renameConversation(payload.tempId, payload.newId);
        // 현재 화면의 라우트 파라미터를 실제 ID로 업데이트합니다.
        navigation.setParams({ conversationId: payload.newId });
      };

      const onAck = (_: any) => {};

      const onStream = (payload: any) => {
        if (!mounted || payload.conversationId !== conversationId) return;
        upsertStreamingAssistant(conversationId, payload.delta ?? '');
        scrollToBottom(true);
      };

      const onComplete = (payload: any) => {
        if (!mounted || payload.conversationId !== conversationId) return;
        endStreamingAssistant(conversationId, payload.text ?? '');
        setSending(false);
        scrollToBottom(true);
      };

      const onError = (payload: any) => {
        if (!mounted || payload.conversationId !== conversationId) return;
        setSending(false);
        Alert.alert('오류', payload.message ?? '메시지 전송에 실패했습니다.');
      };

      socket.on('message:ack', onAck);
      socket.on('message:stream', onStream);
      socket.on('message:complete', onComplete);
      socket.on('message:error', onError);
      socket.on('conversation:created', onCreated);

      return () => {
        mounted = false;
        if(socket){
          socket.off('message:ack', onAck);
          socket.off('message:stream', onStream);
          socket.off('message:complete', onComplete);
          socket.off('message:error', onError);
          socket.off('conversation:created', onCreated);
        }
      };
    })();
  }, [conversationId,navigation,renameConversation,setMessagesForConv, upsertStreamingAssistant, endStreamingAssistant]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => scrollToBottom(true));
    return () => show.remove();
  }, []);

  function scrollToBottom(animated: boolean) {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated }));
  }

  async function send() {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    // 낙관적 유저 메시지
    pushMessage(conversationId, { role: 'user', text, localOnly: true });
    scrollToBottom(true);

    const socket = await getSocket();
    const clientMsgId = await Crypto.randomUUID();
    socket.emit('message:create', { conversationId, clientMsgId, text });
  }

  async function cancel() {
    const socket = await getSocket();
    socket.emit('message:cancel', { conversationId });
  }

  const renderItem = ({ item }: any) =>{
    const isUser = item.role === 'user';
    return (
      <MessageBubble
        item={item}
        isUser={isUser}
        userAvatarUrl={userAvatar}
        botAvatarUrl={botAvatarUrl}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={messages}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollToBottom(false)}
        />
        <ChatInputBar
          input={input}
          onInputChange={setInput}
          onSend={send}
          onCancel={cancel}
          isSending={sending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, marginTop: 30 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
});