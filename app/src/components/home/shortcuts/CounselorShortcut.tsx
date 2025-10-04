import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

type Props = {
  onPress: () => void;
};

export default function CounselorShortcut({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.counselorShortcut} onPress={onPress}>
      <Text style={styles.shortcutLabel}>내 맘에 쏙- ♥{"\n"}심리 상담 예약하기</Text>
      <View style={styles.shortcutIconWrapper}>
        <Ionicons name="search-outline" size={24} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shortcutLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  counselorShortcut: {
    flex: 1,
    backgroundColor: '#eef0ff',
    borderRadius: 20,
    padding: 16,
  },
  shortcutIconWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});