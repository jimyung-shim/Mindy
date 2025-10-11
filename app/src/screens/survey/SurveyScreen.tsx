import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFocusEffect,
  useNavigation,
  RouteProp,
} from "@react-navigation/native";
import { useAuth } from "../../stores/authStore";
import { getSurvey } from "../../services/surveyApi";
import type { SurveyDetail } from "../../types/survey";
import Header from "../../components/common/Header";
import { colors } from "../../theme/colors";
import Accordion from "../../components/common/Accordion";
import SurveySection from "../../components/survey/SurveySection";
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  PSS_QUESTIONS,
} from "../../utils/survey";
import type { AppStackParamList } from "../../navigation/types";

type Props = {
  route: RouteProp<AppStackParamList, "Survey">;
};

export default function SurveyScreen({ route }: Props) {
  const { draftId } = route.params;
  const navigation = useNavigation();
  const accessToken = useAuth((s) => s.accessToken);
  const [survey, setSurvey] = useState<SurveyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await getSurvey(accessToken, draftId);
      setSurvey(data);
    } catch (e) {
      Alert.alert("오류", "문진표를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, draftId]);

  useFocusEffect(
    useCallback(() => {
      void load(); // async 함수인 load를 여기서 호출합니다.
    }, [load])
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () =><SafeAreaView style={{marginBottom:-90}}><Header title="AI 자동 완성 문진표" canGoBack /></SafeAreaView>,
    });
  }, [navigation]);

  if (loading || !survey) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>AI 대화 요약</Text>
        <Text style={styles.summaryText}>{survey.summary}</Text>
      </View>

      {survey.phq9 && (
        <Accordion
          title={`우울증 검사 (PHQ-9) - 총점: ${survey.phq9.totalScore}`}
        >
          <SurveySection
            questions={PHQ9_QUESTIONS}
            answers={survey.phq9.answers}
          />
        </Accordion>
      )}

      {survey.gad7 && (
        <Accordion
          title={`불안장애 검사 (GAD-7) - 총점: ${survey.gad7.totalScore}`}
        >
          <SurveySection
            questions={GAD7_QUESTIONS}
            answers={survey.gad7.answers}
          />
        </Accordion>
      )}

      {survey.pss && (
        <Accordion
          title={`스트레스 검사 (PSS-10) - 총점: ${survey.pss.totalScore}`}
        >
          <SurveySection
            questions={PSS_QUESTIONS}
            answers={survey.pss.answers}
          />
        </Accordion>
      )}

      {survey.cbt && (
        <Accordion title="CBT 인지행동치료 분석">
          <View style={styles.cbtBox}>
            <Text style={styles.cbtItem}>상황: {survey.cbt.situation}</Text>
            <Text style={styles.cbtItem}>
              감정: {survey.cbt.emotion?.name} ({survey.cbt.emotion?.intensity}
              %)
            </Text>
            <Text style={styles.cbtItem}>
              자동적 사고: {survey.cbt.automaticThought}
            </Text>
            <Text style={styles.cbtItem}>
              뒷받침하는 증거:{" "}
              {survey.cbt.supportingEvidence?.join(", ") || "없음"}
            </Text>
            <Text style={styles.cbtItem}>
              반박 증거: {survey.cbt.counterEvidence?.join(", ") || "없음"}
            </Text>
            <Text style={styles.cbtItem}>
              대안적 사고:{" "}
              {survey.cbt.alternativeThoughts?.join(", ") || "없음"}
            </Text>
            <Text style={styles.cbtItem}>
              대안 후 감정: {survey.cbt.emotionAfterAlternative?.name} (
              {survey.cbt.emotionAfterAlternative?.intensity}%)
            </Text>
          </View>
        </Accordion>
      )}

      {/* [!] 제출(수정) 기능은 여기에 추가 구현 필요 */}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  summaryBox: {
    backgroundColor: "#eef0ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginTop:20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: colors.text,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  cbtBox: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cbtItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
    color: colors.text,
  },
});
