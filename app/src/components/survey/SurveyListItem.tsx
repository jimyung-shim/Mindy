import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { phq9Severity } from '../../utils/phq9';
import type { SurveyMineItem } from '../../types/survey';

type Props = {
  item: SurveyMineItem;
  onPress: () => void;
  onDelete: () => void;
};

function StatusBadge({ status }: { status: string }) {
  const isSubmitted = status === 'submitted';
  return (
    <View style={[styles.badge, isSubmitted ? styles.badgeSubmitted : styles.badgeDraft]}>
      <Text style={[styles.badgeText, isSubmitted ? styles.badgeTextSubmitted : styles.badgeTextDraft]}>
        {isSubmitted ? '제출 완료' : '작성 중'}
      </Text>
    </View>
  );
}

export default function SurveyListItem({ item, onPress, onDelete }: Props) {
  const severity = phq9Severity(item.totalScore);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <View style={styles.statusRow}>
            <StatusBadge status={item.status} />
            <Text style={styles.reasonText}>({item.reason === 'risk' ? '위험 신호 감지' : '대화 횟수 도달'})</Text>
        </View>
        <Text style={styles.score}>
          총점: {item.totalScore}점 ({severity})
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton} accessibilityLabel="문진표 삭제">
        <Ionicons name="trash-outline" size={22} color={colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  info: { flex: 1, gap: 4 },
  date: { color: colors.textMuted, fontSize: 13 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  badgeSubmitted: { backgroundColor: colors.primary },
  badgeDraft: { backgroundColor: '#f3f4f6' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  badgeTextSubmitted: { color: '#fff' },
  badgeTextDraft: { color: colors.textMuted },
  reasonText: { color: colors.textMuted, fontSize: 13 },
  score: { fontWeight: '700', fontSize: 16, color: colors.text, marginTop: 2 },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});