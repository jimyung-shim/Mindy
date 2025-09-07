import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { listConversations, createConversation } from '../../services/api';
import { useChatStore } from '../../stores/chatStore';
import { useNavigation } from '@react-navigation/native';
import { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppTabParamList, AppStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'ChatListTab'>,
  NativeStackScreenProps<AppStackParamList>
>;
export default function ChatListScreen({navigation}: Props) {
  const { conversations, setConversations } = useChatStore();
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

  async function onNewChat() {
    const { conversationId } = await createConversation();
    navigation.navigate('Chat', { conversationId });
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <TouchableOpacity onPress={onNewChat} style={{ padding: 12, backgroundColor: '#111', borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>새 대화 시작</Text>
      </TouchableOpacity>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { conversationId: item._id })}
            style={{ padding: 14, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, marginBottom: 10 }}
          >
            <Text style={{ fontWeight: '700' }}>대화 #{item._id.slice(-6)}</Text>
            <Text style={{ color: '#6b7280' }}>
              {new Date(item.lastMessageAt).toLocaleString()} · {item.messageCount} msgs
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
