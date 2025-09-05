import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { colors } from '../../theme/colors';

export default function ChatScreen() {
  return (
    <ScreenContainer title="채팅" subtitle="상담가와 대화를 시작해 보세요">
      <View style={styles.box}>
        <Text style={styles.muted}>채팅 기능은 곧 제공됩니다.</Text>
      </View>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  box: { padding: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', borderRadius: 16 },
  muted: { color: colors.textMuted, textAlign: 'center' },
});
