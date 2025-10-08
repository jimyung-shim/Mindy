import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

// API 응답에 맞춰 예약 정보 타입을 정의합니다.
export type ReservationItem = {
  id: string;
  reservationAt: string;
  location: 'ONLINE' | 'OFFLINE';
  counselor: {
    name: string;
    title: string;
  };
};

type Props = {
  item: ReservationItem;
};

export default function ReservationListItem({ item }: Props) {
  const reservationDate = new Date(item.reservationAt);
  const dateString = reservationDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeString = reservationDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isPast = reservationDate.getTime() < new Date().getTime();

  return (
    <View style={[styles.card, isPast && styles.pastCard]}>
      <View style={styles.header}>
        <Text style={[styles.dateText, isPast && styles.pastText]}>{dateString}</Text>
        <View style={[styles.statusBadge, isPast ? styles.pastBadge : styles.upcomingBadge]}>
          <Text style={styles.statusText}>{isPast ? '상담 완료' : '예정'}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.counselorInfo}>
          <Text style={[styles.counselorName, isPast && styles.pastText]}>{item.counselor.name}</Text>
          <Text style={[styles.counselorTitle, isPast && styles.pastText]}>{item.counselor.title}</Text>
        </View>
        <View style={styles.timeInfo}>
          <Ionicons name="time-outline" size={16} color={isPast ? colors.textMuted : colors.text} />
          <Text style={[styles.timeText, isPast && styles.pastText]}>{timeString}</Text>
        </View>
        <View style={styles.locationInfo}>
          <Ionicons name={item.location === 'ONLINE' ? 'laptop-outline' : 'business-outline'} size={16} color={isPast ? colors.textMuted : colors.text} />
          <Text style={[styles.locationText, isPast && styles.pastText]}>
            {item.location === 'ONLINE' ? '온라인' : '오프라인'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pastCard: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  upcomingBadge: {
    backgroundColor: colors.primary,
  },
  pastBadge: {
    backgroundColor: colors.textMuted,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  body: {
    gap: 8,
  },
  counselorInfo: {
    marginBottom: 4,
  },
  counselorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  counselorTitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 15,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 15,
  },
  pastText: {
    color: colors.textMuted,
  }
});