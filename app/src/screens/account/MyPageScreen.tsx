import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  SectionList,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../stores/authStore';
import { Ionicons, Feather } from '@expo/vector-icons';
import MyInfoCard from '../../components/MyInfoCard';
import { usePersona } from '../../stores/personaStore';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// *** 마이페이지의 모든 기능들 완성 후에 주석 풀고 아래 Props 지우기 ***
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppTabParamList, AppStackParamList } from '../../navigation/types';
// type Props = NativeStackScreenProps<AppTabParamList, 'MypageTab'>;
type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'MypageTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function MyPageScreen({ navigation }: Props) {
  const { logout, nickname } = useAuth();
  const clearPersona = usePersona((s) => s.clearPersona);
  // TODO: 로그인 후 사용자 프로필 상태에서 가져오세요.
  const displayName = nickname ?? '김○○';

  // const onEditProfile = useCallback(() => {
  //   navigation.navigate('ProfileEdit'); // 존재하는 라우트명으로 변경
  // }, [navigation]);

  // [!] 3. 아직 없는 기능은 Alert로 임시 처리
  const onPrepareFeature = useCallback((featureName: string) => {
    Alert.alert('알림', `${featureName} 기능은 현재 준비 중입니다.`);
  }, []);

  const onLogout = useCallback(async () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            clearPersona();
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'Login' }], // 로그인 스택 시작 루트로 변경
            // });
          } catch (e: any) {
            Alert.alert('실패', e?.message ?? '로그아웃 실패');
          }
        },
      },
    ]);
  }, [logout, navigation, clearPersona]);

  const sections = [
    {
      title: '',
      data: [
        {
          key: 'questionnaire',
          label: '문진표',
          icon: <Feather name="list" size={20} />,
          onPress: () => navigation.navigate('SurveyList'), // 라우트명 변경
        },
        {
          key: 'reservation',
          label: '예약',
          icon: <Feather name="calendar" size={20} />,
          onPress: () => onPrepareFeature('예약') // 임시 처리
        },
        {
          key: 'about',
          label: 'About',
          icon: <Feather name="star" size={20} />,
          onPress: () => onPrepareFeature('About'), // 임시 처리
        },
      ],
    },
    {
      title: '',
      data: [
        {
          key: 'logout',
          label: '로그아웃',
          icon: <Feather name="log-out" size={20} />,
          onPress: onLogout,
          danger: true,
        },
        {
          key: 'settings',
          label: '설정',
          icon: <Feather name="settings" size={20} />,
          onPress: () => onPrepareFeature('설정'), // 임시처리
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Ionicons name="person-circle-outline" size={56} />
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={styles.displayName}>{displayName}</Text>
        </View>
        <Pressable style={styles.editBtn} onPress={onEditProfile}>
          <Text style={styles.editBtnText}>편집하기</Text>
        </Pressable>
      </View> */}

      <View style={{ paddingHorizontal: 12, marginBottom: 8 }}>
        <MyInfoCard />
      </View>

      <View style={styles.divider} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <RowItem
            label={item.label}
            icon={item.icon}
            onPress={item.onPress}
            danger={item.danger}
          />
        )}
        renderSectionHeader={() => <View style={{ height: 8 }} />}
        ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

function RowItem({
  label,
  icon,
  onPress,
  danger,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>{icon}</View>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  displayName: {
    fontSize: 18,
    fontWeight: '600',
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#6D68FF',
  },
  editBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EAEAEA',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  itemDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EAEAEA',
    marginLeft: 44, // 아이콘 영역 제외하고 라인 시작
  },
  row: {
    paddingHorizontal: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    width: 28,
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
  },
  rowLabelDanger: {
    color: '#D93636',
    fontWeight: '600',
  },
});
