import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  Button,
} from 'react-native';
// 1. 새로운 캘린더 라이브러리를 import 합니다.
import CalendarPicker from 'react-native-calendar-picker';
import Wheely from 'react-native-wheely';
import { colors } from '../../theme/colors';
import Header from '../../components/common/Header';
import { http, authedPost } from '../../services/http';
import { Counselor } from '../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 네비게이션 파라미터 타입 정의
type RootStackParamList = {
  CounselorDetail: { counselorId: string };
  // 여기에 프로젝트의 다른 스크린과 파라미터를 추가할 수 있습니다.
};

type CounselorDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CounselorDetail'
>;

export default function CounselorDetailScreen({ route, navigation }: CounselorDetailScreenProps) {
  const { counselorId } = route.params;

  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. selectedDate의 타입을 Date 객체로 변경합니다.
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<'ONLINE' | 'OFFLINE' | null>(null);

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const isBookingReady = !!(selectedDate && selectedLocation);

  useEffect(() => {
    const fetchCounselorDetails = async () => {
      try {
        const response = await http.get<Counselor>(`/counselors/${counselorId}`);
        setCounselor(response.data);
      } catch (e) {
        setError('상담사 정보를 불러오는 데 실패했습니다.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounselorDetails();
  }, [counselorId]);

  // 3. 새로운 캘린더 라이브러리에 맞는 핸들러 함수
  const onDateChange = (date: Date) => {
    setSelectedDate(date);
    setHour(10);
    setMinute(0);
  };

  const handleTimeConfirm = () => {
    setTimePickerVisible(false);
  };

  const handleBooking = async () => {
    if (!isBookingReady || !counselor) return;

    // selectedDate가 이미 Date 객체이므로 바로 사용합니다.
    const reservationDate = new Date(selectedDate);
    reservationDate.setHours(hour, minute, 0, 0);

    const bookingInfo = {
      counselorId: counselor.id,
      reservationAt: reservationDate,
      location: selectedLocation,
    };
    try {
      await authedPost('/reservations', bookingInfo);
      Alert.alert('예약 완료', '상담 예약이 성공적으로 완료되었습니다.');
      navigation.goBack();
    } catch (e) {
      console.error('Reservation failed:', e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !counselor) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error || '상담사 정보를 찾을 수 없습니다.'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="상담사 정보 및 예약" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileSection}>
          <Text style={styles.name}>{counselor.name}</Text>
          <Text style={styles.bio}>{counselor.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>날짜 선택</Text>
          {/* 4. CalendarPicker 컴포넌트로 교체 */}
          <CalendarPicker
            onDateChange={onDateChange}
            weekdays={['일', '월', '화', '수', '목', '금', '토']}
            months={['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']}
            previousTitle="이전"
            nextTitle="다음"
            selectedDayColor={colors.primary}
            selectedDayTextColor="#FFFFFF"
            todayBackgroundColor={colors.border}
            minDate={new Date()} // 오늘 이전 날짜는 선택 불가
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>시간 선택</Text>
          <TouchableOpacity
            onPress={() => setTimePickerVisible(true)}
            style={[styles.selectButton, !selectedDate && styles.disabledButton]}
            disabled={!selectedDate}
          >
            <Text style={styles.selectButtonText}>
              {selectedDate ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` : '날짜를 먼저 선택해주세요'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상담 방식 선택</Text>
          <View style={styles.locationContainer}>
            <TouchableOpacity
              style={[ styles.locationButton, selectedLocation === 'ONLINE' && styles.locationButtonSelected ]}
              onPress={() => setSelectedLocation('ONLINE')}>
              <Text style={[ styles.locationText, selectedLocation === 'ONLINE' && styles.locationTextSelected ]}>온라인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[ styles.locationButton, selectedLocation === 'OFFLINE' && styles.locationButtonSelected ]}
              onPress={() => setSelectedLocation('OFFLINE')}>
              <Text style={[ styles.locationText, selectedLocation === 'OFFLINE' && styles.locationTextSelected ]}>오프라인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isTimePickerVisible}
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.wheelyContainer}>
              <Wheely options={Array.from({ length: 11 }, (_, i) => String(10 + i))} selectedIndex={hour - 10} onChange={(index) => setHour(10 + index)} itemTextStyle={styles.wheelyItem} itemHeight={50} />
              <Text style={styles.wheelySeparator}>:</Text>
              <Wheely options={['00', '30']} selectedIndex={minute === 0 ? 0 : 1} onChange={(index) => setMinute(index === 0 ? 0 : 30)} itemTextStyle={styles.wheelyItem} itemHeight={50} />
            </View>
            <Button title="확인" onPress={handleTimeConfirm} />
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[ styles.bookingButton, !isBookingReady && styles.bookingButtonDisabled ]}
          onPress={handleBooking}
          disabled={!isBookingReady}>
          <Text style={styles.bookingButtonText}>예약하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { paddingBottom: 100 },
  profileSection: { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  bio: { fontSize: 14, color: colors.text },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  selectButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 18,
    color: colors.text,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  wheelyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  wheelyItem: {
    fontSize: 24,
  },
  wheelySeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  locationContainer: { flexDirection: 'row' },
  locationButton: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  locationButtonSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  locationText: { fontSize: 16, color: colors.text },
  locationTextSelected: { color: '#fff', fontWeight: 'bold' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookingButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookingButtonDisabled: {
    backgroundColor: colors.border,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});