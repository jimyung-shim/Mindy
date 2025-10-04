import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { colors } from '../../theme/colors';

// 한글 설정
LocaleConfig.locales['kr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  //today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';

export default function CalendarView() {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [selectedDate, setSelectedDate] = useState(todayString);
  
  // 예약 기능 추가 시 이 부분을 props로 받아오거나 API 호출로 대체합니다.
  const MOCK_RESERVATION_DATE = '2025-12-20';

  const markedDates = useMemo(() => {
    const reservationMark = { marked: true, dotColor: colors.primary };
    const selectedMark = { selected: true, selectedColor: colors.primaryLight, selectedTextColor: '#fff' };

    return {
      [MOCK_RESERVATION_DATE]: reservationMark,
      [selectedDate]: {
        ...(selectedDate === MOCK_RESERVATION_DATE ? reservationMark : {}),
        ...selectedMark
      }
    }
  }, [selectedDate, MOCK_RESERVATION_DATE]);

  return (
    <View style={styles.card}>
      <Calendar
        current={todayString}
        onDayPress={day => {
          setSelectedDate(day.dateString);
        }}
        markedDates={markedDates}
        theme={{
          arrowColor: colors.primary,
          todayTextColor: colors.primary,
        }}
        monthFormat={'yyyy년 MM월'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginBottom: 12,
  },
});