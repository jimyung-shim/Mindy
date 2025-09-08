import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl, Alert } from 'react-native';
import { listConversations, createConversation, deleteConversation as apiDeleteConversation } from '../../services/api';
import { useChatStore } from '../../stores/chatStore';
import { useNavigation } from '@react-navigation/native';
import { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppTabParamList, AppStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import ConversationListItem from '../../components/chat/ConversationListItem';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'ChatListTab'>,
  NativeStackScreenProps<AppStackParamList>
>;
export default function ChatListScreen({navigation}: Props) {
  const { conversations, setConversations } = useChatStore();
  const removeConversation = useChatStore((s) => (s as any).removeConversation);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    try {
      const { items } = await listConversations(20);
      setConversations(items.map((it: any) => ({
        _id: String(it._id),
        lastMessageAt: it.lastMessageAt,
        messageCount: it.messageCount ?? 0,
      })));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={load}
          disabled={refreshing}
          accessibilityLabel="대화목록 새로고침"
          style={{ paddingHorizontal: 12, paddingVertical: 6, opacity: refreshing ? 0.5 : 1 }}
        >
          <Ionicons name="refresh" size={22} /* color={colors.text} */ />
        </TouchableOpacity>
      ),
    });
  }, [navigation, refreshing]); // refreshing 바뀌면 버튼 상태 갱신

  async function onNewChat() {
    navigation.navigate('Chat', { conversationId: 'new' });
  }

  function onDelete(id: string) {
    Alert.alert('대화 삭제', '이 대화와 안의 메시지가 모두 삭제됩니다. 계속할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          // (선택) 낙관적 제거
          removeConversation(id);
          try {
            await apiDeleteConversation(id);
          } catch (e: any) {
            // 실패 시 다시 로드(롤백) 또는 토스트
            await load();
            Alert.alert('삭제 실패', e?.message ?? '서버 오류');
          }
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <TouchableOpacity onPress={onNewChat} style={{ padding: 12, backgroundColor: '#111', borderRadius: 8, marginTop: 30 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>새 대화 시작</Text>
      </TouchableOpacity>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        renderItem={({ item }) => (
          <ConversationListItem
            item={item}
            onPress={() => navigation.navigate('Chat', { conversationId: item._id })}
            onDelete={() => onDelete(item._id)}
          />
        )}
      />
    </View>
  );
}
