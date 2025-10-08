import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyReservations } from '../../services/api';
import ReservationListItem, { ReservationItem } from '../../components/reservation/ReservationListItem';
import { colors } from '../../theme/colors';
import Header from '../../components/common/Header';


export default function MyReservationsScreen() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getMyReservations();
      setReservations(data);
    } catch (e: any) {
      setError(e?.message ?? '예약 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면에 들어올 때마다 데이터를 새로고침
  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [loadReservations])
  );
  
  if (loading && reservations.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="나의 예약 내역" canGoBack />
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReservationListItem item={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadReservations} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>예약 내역이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: { 
    padding: 16 
  },
  center: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  emptyText: {
    color: colors.textMuted,
  },
});