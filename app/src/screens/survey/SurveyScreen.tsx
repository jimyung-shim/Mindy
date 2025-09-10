import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getSurvey, submitSurvey } from '../../services/surveyApi';
import { useAuth } from '../../stores/authStore';
import { ScoreRadio } from '../../components/survey/ScoreRadio';
import { phq9Severity } from '../../utils/phq9';

const QUESTIONS = [
  '1. 일이나 활동에 대한 흥미나 즐거움이 거의 없었다',
  '2. 기분이 가라앉거나, 우울하거나, 희망이 없었다',
  '3. 잠들기 어렵거나 자주 깼다 또는 너무 많이 잤다',
  '4. 피곤하다고 느끼거나 기운이 거의 없었다',
  '5. 식욕이 떨어지거나 과식을 했다',
  '6. 자신을 나쁘게 느꼈다 — 실패자라고 느끼거나 자신/가족을 실망시켰다',
  '7. 신문을 읽거나 TV를 보는 것과 같은 일에도 집중하기 어려웠다',
  '8. 다른 사람들이 알아차릴 정도로 매우 느리게 움직이거나 말하거나, 반대로 평소보다 많이 초조하고 안절부절 못했다',
  '9. 차라리 죽는 것이 낫겠다고 생각하거나 자해할 생각을 했다',
];

export default function SurveyScreen() {
  const { params } = useRoute<any>(); // { draftId: string }
  const navigation = useNavigation<any>();
  const token = useAuth((s) => s.accessToken);

  const [answers, setAnswers] = useState<number[]>(Array(9).fill(0));
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await getSurvey(token!, params.draftId);
        if (cancelled) return;
        if (Array.isArray(d.answers) && d.answers.length === 9) setAnswers(d.answers);
        if (typeof d.summary === 'string') setSummary(d.summary);
      } catch {
        Alert.alert('오류', '문진 초안을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params.draftId, token]);

  const total = useMemo(() => answers.reduce((s, n) => s + n, 0), [answers]);
  const severity = useMemo(() => phq9Severity(total), [total]);

  const onSubmit = async () => {
    if (!Array.isArray(answers) || answers.length !== 9 || answers.some((n) => n < 0 || n > 3)) {
      Alert.alert('입력 오류', '각 문항에 대해 0~3 점수를 선택해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitSurvey(token!, params.draftId, { answers, summary });
      Alert.alert('제출 완료', `총점 ${res.totalScore}점 (${severity})`, [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('오류', '제출에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>문진 초안을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>문진표 (PHQ-9)</Text>

      {QUESTIONS.map((q, idx) => (
        <View key={idx} style={{ gap: 8 }}>
          <Text style={{ fontSize: 16 }}>{q}</Text>
          <ScoreRadio
            value={answers[idx]}
            onChange={(n) => {
              const cp = answers.slice();
              cp[idx] = n;
              setAnswers(cp);
            }}
          />
        </View>
      ))}

      <View style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}>
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>요약/메모(선택)</Text>
        <Text>{summary || '(없음)'}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Text style={{ fontSize: 16 }}>총점: {total}</Text>
        <Text style={{ fontSize: 16, color: '#666' }}>({severity})</Text>
      </View>

      <View style={{marginBottom: 50}}><Button title={submitting ? '제출 중...' : '제출하기'} disabled={submitting} onPress={onSubmit}/></View>
    </ScrollView>
  );
}
