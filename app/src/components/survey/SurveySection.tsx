import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  questions: string[];
  answers?: number[];
};

export default function SurveySection({ questions, answers }: Props) {
  if (!answers) return <Text>결과가 없습니다.</Text>;

  return (
    <View style={styles.container}>
      {questions.map((q, i) => (
        <View key={i} style={styles.questionRow}>
          <Text style={styles.questionText}>{i + 1}. {q}</Text>
          <Text style={styles.scoreText}>{answers[i] ?? 'N/A'}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 16,
  },
});