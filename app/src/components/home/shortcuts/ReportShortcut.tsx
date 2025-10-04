import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

type Props = {
  onPress: () => void;
};

export default function ReportShortcut({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.reportShortcut} onPress={onPress}>
      <Text style={styles.shortcutLabel}>AI CBT 기반,{"\n"}마음 분석소 🏠</Text>
      <View style={styles.shortcutIconWrapper}>
        <Ionicons name="document-text-outline" size={24} color={colors.primary} />
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
  reportShortcut: {
    flex: 1,
    backgroundColor: '#f5f6fb',
    borderRadius: 20,
    padding: 16,
  },
  shortcutIconWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});