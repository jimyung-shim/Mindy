import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

type Props = {
  onPress: () => void;
};

export default function ChatShortcut({ onPress }: Props) {
  return (
    <View>
    <Text style={styles.shortcutLabel}>가벼운 마음,{"\n"}속마음 털어놓기 🍀</Text>
    <TouchableOpacity style={styles.chatShortcut} onPress={onPress}>
      <Text style={styles.chatButtonText}>AI 챗봇 심리상담</Text>
      <View style={styles.chatButtonContent}>
        <Ionicons name="chatbubbles-outline" size={32} color="#fff" />
        <Text style={styles.chatButtonText}>채팅 시작</Text>
      </View>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shortcutLabel: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
  },
  chatShortcut: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  chatButtonContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
});