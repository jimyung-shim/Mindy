import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { usePersona } from '../../stores/personaStore';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { personaLabel, imageUrl, reason } = usePersona();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!imageUrl) {
      // 페르소나 미배정 상태면 곧장 선택 화면으로 유도
      navigation.navigate('PersonaSelect');
    }
  }, [imageUrl, navigation]);

  return (
    <ScreenContainer title="홈" subtitle="오늘도 가볍게 마음 체크하기">
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
    borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff',
    borderRadius: 16, padding: 16, alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  avatar: { width: 160, height: 160, borderRadius: 12, backgroundColor: '#f5f6fb', marginBottom: 12 },
  placeholder: { borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 6 },
  reason: { color: colors.textMuted, textAlign: 'center' },
  helper: { marginTop: 8, color: colors.textMuted, textAlign: 'center' },
});
