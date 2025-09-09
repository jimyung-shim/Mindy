import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Props = {
  input: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onCancel: () => void;
  isSending: boolean;
};

export default function ChatInputBar({ input, onInputChange, onSend, onCancel, isSending }: Props) {
  const isSendDisabled = isSending || !input.trim();

  return (
    <View style={styles.inputBar}>
      <TextInput
        value={input}
        onChangeText={onInputChange}
        placeholder="오늘 하루는 어땠나요?"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        multiline
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={isSendDisabled}
        accessibilityLabel="전송"
        style={[styles.iconBtn, isSendDisabled && styles.iconBtnDisabled]}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCancel} accessibilityLabel="중지" style={styles.stopBtn}>
        <Text style={{ color: colors.danger, fontWeight: '600' }}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: '#fff',
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 90
  },
  input: {
    flex: 1, minHeight: 40, maxHeight: 120,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 16, backgroundColor: '#f9fafb',
  },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  iconBtnDisabled: { opacity: 0.5 },
  stopBtn: { paddingHorizontal: 8, height: 40, justifyContent: 'center' },
});