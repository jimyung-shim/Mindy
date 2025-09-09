import 'react-native-get-random-values';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import Header from '../../components/common/Header';

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

    async function connectAndListen() {
      // 대화 내역 먼저 불러오기
      if (conversationId !== 'new' && mounted) {
        try {
          const messages = await getMessages(conversationId);
          if (mounted) setMessagesForConv(conversationId, messages);
        } catch (e) {
          console.error('Failed to load message history', e);
          if (mounted) Alert.alert('오류', '이전 대화 내역을 불러오지 못했습니다.');
        }
      }

      // 소켓 연결 및 리스너 등록
      socket = await getSocket({ onReconnect: () => {} });
      if (!mounted) return; // 연결되는 동안 unmount 되면 리스너 등록 방지
      
      socket.on('conversation:created', onCreated);
      socket.on('message:ack', onAck);
      socket.on('message:stream', onStream);
      socket.on('message:complete', onComplete);
      socket.on('message:error', onError);
    }

    connectAndListen();

    

    return () => {
      mounted = false;
      if(socket){
        socket.off('conversation:created', onCreated);
        socket.off('message:ack', onAck);
        socket.off('message:stream', onStream);
        socket.off('message:complete', onComplete);
        socket.off('message:error', onError);
      }
    };
  }, [conversationId,navigation,renameConversation,setMessagesForConv, upsertStreamingAssistant, endStreamingAssistant]);

  useLayoutEffect(() => {
  // 부모 네비게이터(TabNavigator)를 찾아 옵션을 설정합니다.
  const parent = navigation.getParent();
  parent?.setOptions({
    tabBarStyle: { display: 'none' },
  });

  navigation.setOptions({
    header: () => (
      <Header
        title={`대화 #${conversationId.slice(-6)}`}
        canGoBack
      />
    ),
  });

  // 화면을 벗어날 때(unmount) 원래대로 복구합니다.
  return () => {
    parent?.setOptions({
      tabBarStyle: { display: 'flex' },
    });
  };
}, [navigation, conversationId]);

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
    const { personaKey } = usePersona.getState();
    setInput('');
    setSending(true);

    // 낙관적 유저 메시지
    pushMessage(conversationId, { role: 'user', text, localOnly: true });
    scrollToBottom(true);

    const socket = await getSocket();
    const clientMsgId = await Crypto.randomUUID();
    socket.emit('message:create', { conversationId, clientMsgId, text, personaKey });
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
          keyExtractor={(item) => item._id ?? String(Math.random())}
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
  safe: { flex: 1, backgroundColor: colors.bg},
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
});