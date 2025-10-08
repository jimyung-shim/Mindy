// app/src/navigation/types.ts
import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 로그인/회원가입 화면 목록 타입
export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

// 공통 Counselor 타입
export type Counselor = {
  id: string;
  name: string;
  title: string;
  bio: string;
  tags: string[];
  imageUrl: string;
};

// 하단 탭 네비게이터 화면 목록
export type AppTabParamList = {
  HomeTab: undefined;
  ChatListTab: undefined;
  ReserveTab: undefined;
  MypageTab: undefined;
};

// 최상위 스택 네비게이터 화면 목록
export type AppStackParamList = {
  Tabs: NavigatorScreenParams<AppTabParamList>;
  PersonaSelect: undefined;
  Chat: { conversationId: string };
  Survey: { draftId: string };
  SurveyList: undefined;
  CounselorDetail: { counselorId: string }; // 상세 화면 추가
};

// 복구: 최상위 루트 네비게이터 타입
export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    App: NavigatorScreenParams<AppStackParamList>;
};

// ReservationScreen에서 사용할 Props 타입
export type ReservationScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'ReserveTab'>,
  NativeStackScreenProps<AppStackParamList>
>;