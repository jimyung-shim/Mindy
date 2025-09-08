import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import type { ChatMessage } from '../../stores/chatStore';

type Props = {
  item: ChatMessage;
  isUser: boolean;
  userAvatarUrl?: string;
  botAvatarUrl?: string;
};

export default function MessageBubble({ item, isUser, userAvatarUrl, botAvatarUrl }: Props) {
  const avatarSource = isUser
    ? userAvatarUrl ? { uri: userAvatarUrl } : undefined
    : botAvatarUrl ? { uri: botAvatarUrl } : undefined;

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
        <Text style={[styles.msgText, isUser ? styles.userText : styles.botText]}>{item.text}</Text>
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

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-end' },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  avatarWrap: { width: 32, height: 32, marginHorizontal: 6, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f2f6' },
  bubble: { maxWidth: '78%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14 , marginTop:5},
  userBubble: { backgroundColor: '#111827', borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: '#eef0ff', borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, lineHeight: 20 },
  userText: { color: '#fff' },
  botText: { color: colors.text },
});