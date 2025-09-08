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
    const avatarSource =
      isUser
        ? (userAvatar ? { uri: userAvatar } : undefined)
        : (botAvatarUrl ? { uri: botAvatarUrl } : undefined);

    return (
      <View style={[styles.row, isUser ? styles.rowRight : styles.rowLeft]}>
        {!isUser && (
          <View style={styles.avatarWrap}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <Ionicons name="sparkles-outline" size={28} color={colors.primary} />
            )}
          </View>
        )}

        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.msgText, isUser ? styles.userText : styles.botText]}>
            {item.text}
          </Text>
        </View>

        {isUser && (
          <View style={styles.avatarWrap}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={28} color={colors.textMuted} />
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        keyboardVerticalOffset={0} // 헤더가 있으면 그 높이만큼 조정
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

        {/* 하단 입력 바 */}
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="오늘 하루는 어땠나요?"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            multiline
          />

          <TouchableOpacity
            onPress={send}
            disabled={sending || !input.trim()}
            accessibilityLabel="전송"
            style={[styles.iconBtn, (sending || !input.trim()) && styles.iconBtnDisabled]}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={cancel} accessibilityLabel="중지" style={styles.stopBtn}>
            <Text style={{ color: colors.danger, fontWeight: '600' }}>Stop</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, marginTop: 30 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-end' },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  avatarWrap: { width: 32, height: 32, marginHorizontal: 6, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f2f6' },
  bubble: { maxWidth: '78%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14 },
  userBubble: { backgroundColor: '#111827', borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: '#eef0ff', borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, lineHeight: 20 },
  userText: { color: '#fff' },
  botText: { color: colors.text },
  inputBar: {
    borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: '#fff',
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 30
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
  },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  iconBtnDisabled: { opacity: 0.5 },
  stopBtn: { paddingHorizontal: 8, height: 40, justifyContent: 'center' },
});