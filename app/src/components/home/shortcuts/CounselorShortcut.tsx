import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

type Props = {
  onPress: () => void;
};

export default function CounselorShortcut({ onPress }: Props) {
  return (
    <View>
    <Text style={styles.shortcutLabel}>내 맘에 쏙- ♥{"\n"}심리 상담 예약하기</Text>
    <TouchableOpacity style={styles.counselorShortcut} onPress={onPress}>
      <View style={styles.shortcutIconWrapper}>
        <Text style={styles.counslerButtonText}>상담사 찾기{"  "}
            <Ionicons name="search-outline" size={24} color={colors.primary} />
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
  counslerButtonText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 8,
  },
});