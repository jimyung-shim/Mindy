import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Props = {
  item: {
    _id: string;
    lastMessageAt: string;
    messageCount: number;
  };
  onPress: () => void;
  onDelete: () => void;
};

export default function ConversationListItem({ item, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>대화 #{item._id.slice(-6)}</Text>
        <Text style={styles.subtitle}>
          {new Date(item.lastMessageAt).toLocaleString()} · {item.messageCount} msgs
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} accessibilityLabel="대화 삭제" style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color={colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft:16,
    marginRight:16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
});