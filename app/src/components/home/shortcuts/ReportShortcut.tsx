import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

type Props = {
  onPress: () => void;
};

export default function ReportShortcut({ onPress }: Props) {
  return (
    <View>
    <Text style={styles.shortcutLabel}>AI CBT 기반, 마음 분석소 🏠</Text>
    <TouchableOpacity style={styles.reportShortcut} onPress={onPress}>
      
      <View style={styles.shortcutIconWrapper}>
        <Text style={styles.reportButtonText}>마음 리포트 {"  "}
            <Ionicons name="document-text-outline" size={24} color={colors.primary} />
        </Text>
      </View>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shortcutLabel: {
    color: colors.text,
    fontSize: 12,
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
  reportButtonText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 8,
  },
});