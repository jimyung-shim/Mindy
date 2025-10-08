import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, TouchableOpacity } from 'react-native';
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
import ChatShortcut from '../../components/home/shortcuts/ChatShortcut';
import CounselorShortcut from '../../components/home/shortcuts/CounselorShortcut';
import ReportShortcut from '../../components/home/shortcuts/ReportShortcut';
import Header from '../../components/common/Header';
import { useDrawerStore } from '../../stores/drawerStore';
import { Ionicons } from '@expo/vector-icons';

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
  const { openDrawer } = useDrawerStore(); // store에서 openDrawer 함수 가져오기

  // 채팅 화면으로 바로 이동
  const handleNewChatPress = () => {
    navigation.navigate('Chat', { conversationId: 'new' });
  };

  const handleComingSoonPress = (featureName: string) => {
    Alert.alert('알림', `${featureName} 기능은 현재 준비 중입니다.`);
  };

  const handleReportPress = () => {
    // MyPageScreen의 문진표 목록 이동 로직과 동일 
    navigation.navigate('SurveyList');
  };

  // 메뉴 버튼을 누르면 store의 openDrawer 함수 호출
  const handleProfilePress = () => {
    openDrawer();
  };

  useEffect(() => {
    if (!imageUrl) {
      // 페르소나 미배정 상태면 곧장 선택 화면으로 유도
      navigation.navigate('PersonaSelect');
    }
  }, [imageUrl, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header
        title="Mindy"
        headerLeft={
          <TouchableOpacity onPress={handleProfilePress} style={{ padding: 8, marginLeft: 8 }}>
            <Ionicons name="menu" size={26} color={colors.text} />
          </TouchableOpacity>
        }
      />
    <ScreenContainer>
      {/* --- 환영 메시지 --- */}
      <View style={{flexDirection: 'row' }}>
        <Image source={require('../../../assets/icons/user.png')} style={styles.userIcon} />
        <Text style={styles.welcomeTitle}>안녕하세요, {nickname ?? '마인디'}님 :)</Text>
      </View>
      
      <View style={{flexDirection: 'row' }}>
        <Text style={styles.welcomeSubtitle}>캘린더 확인하기</Text>
        <Image source={require('../../../assets/icons/calendar.gif')} style={styles.calendarIcon} />
      </View>
      {/* --- 캘린더 컴포넌트 --- */}
      <CalendarView /> 
      
      {/* --- 예약 정보 (임시 UI) --- */}
      <Pressable style={styles.reservationCard}>
        <Image source={require('../../../assets/icons/counselor.png')} style={styles.counselorIcon} />
        <View>
          <Text style={styles.reservationTitle}>김은경 인턴 상담사님과</Text>
          <Text style={styles.reservationTime}>12월 20일 / 15:00</Text>
        </View>
        <Text style={styles.dDay}>상담 D-5</Text>
      </Pressable>

      {/* --- 바로가기 버튼 영역 --- */}
      <View style={styles.shortcutContainer}>
        {/* 왼쪽 큰 버튼 */}
        <ChatShortcut onPress={handleNewChatPress} />

        {/* 오른쪽 작은 버튼 2개 */}
        <View style={styles.rightColumn}>
          <CounselorShortcut onPress={() => handleComingSoonPress('상담사 찾기')} />
          <ReportShortcut onPress={handleReportPress} />
        </View>
      </View>

    </ScreenContainer>
    </View>
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
    fontSize: 16,
    color: colors.textMuted,
    paddingHorizontal: 4,
    marginBottom: 16,
    fontWeight: 'bold',
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
  },
  shortcutContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  rightColumn: {
    flex: 1,
    gap: 12,
  },
  userIcon: {
    width: 35,
    height: 35,
  },
  calendarIcon: {
    width: 20,
    height: 20,
  },
  counselorIcon: {
    width: 60,
    height: 60,
  },
});
