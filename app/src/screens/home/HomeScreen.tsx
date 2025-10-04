import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { usePersona } from '../../stores/personaStore';
import { colors } from '../../theme/colors';
import { useAuth } from '../../stores/authStore';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import type { AppTabParamList, AppStackParamList } from '../../navigation/types';
import CalendarView from '../../components/home/CalendarComponent';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<AppStackParamList>
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const { personaLabel, imageUrl, reason } = usePersona();
  const nickname = useAuth((s) => s.nickname);


  useEffect(() => {
    if (!imageUrl) {
      // 페르소나 미배정 상태면 곧장 선택 화면으로 유도
      navigation.navigate('PersonaSelect');
    }
  }, [imageUrl, navigation]);

  return (
    <ScreenContainer>
      {/* --- 환영 메시지 --- */}
      <Text style={styles.welcomeTitle}>안녕하세요, {nickname ?? '마인디'}님 :)</Text>
      <Text style={styles.welcomeSubtitle}>오늘도 가볍게 마음을 체크해 보세요.</Text>
      
      {/* --- 캘린더 컴포넌트 --- */}
      <CalendarView /> 
      
      {/* --- 예약 정보 (임시 UI) --- */}
      <Pressable style={styles.reservationCard}>
        <View>
          <Text style={styles.reservationTitle}>김은경 인턴 상담사님과</Text>
          <Text style={styles.reservationTime}>12월 20일 / 15:00</Text>
        </View>
        <Text style={styles.dDay}>상담 D-5</Text>
      </Pressable>
      
      {/* --- 바로가기 버튼들 (다음 단계에서 추가 예정) --- */}



      {/*배정 받은 페르소나 상담가 표시*/}
      <View style={styles.card}>
        <Text style={styles.title}>나의 상담가</Text>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} resizeMode="contain" />
        ) : (
          <View style={[styles.avatar, styles.placeholder]} />
        )}
        <Text style={styles.label}>{personaLabel ?? '아직 배정되지 않았어요'}</Text>
        {!!reason && <Text style={styles.reason}>{reason}</Text>}
        {!imageUrl && (
          <Text style={styles.helper}>
            하단 탭의 <Text style={{ fontWeight: '700' }}>마이페이지</Text> → 페르소나 선택으로 배정해 보세요.
          </Text>
        )}
      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#f5f6fb',
    marginBottom: 12,
  },
  placeholder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  reason: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  helper: {
    marginTop: 8,
    color: colors.textMuted,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  reservationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f6fb',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  reservationTitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
  reservationTime: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  dDay: {
    backgroundColor: colors.primary,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
  }
});
