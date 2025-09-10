import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, RefreshControl, StyleSheet} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../stores/authStore';
import { listMySurveys } from '../../services/surveyApi';
import type { SurveyMineItem } from '../../types/survey';
import SurveyListItem from '../../components/survey/SurveyListItem';
import Header from '../../components/common/Header';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function SurveyListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const accessToken = useAuth((s) => s.accessToken);
  const [surveys, setSurveys] = useState<SurveyMineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setError(null);
    setLoading(true);
    try {
      const data = await listMySurveys(accessToken);
      setSurveys(data);
    } catch (e: any) {
      setError(e?.message ?? '목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));
  
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title="내 문진표" canGoBack />,
    });
  }, [navigation]);


  if (loading && surveys.length === 0) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <FlatList
      data={surveys}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SurveyListItem
          item={item}
          onPress={() => navigation.navigate('Survey', { draftId: item.id })}
        />
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={<View style={styles.center}><Text>작성된 문진표가 없습니다.</Text></View>}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.danger },
});