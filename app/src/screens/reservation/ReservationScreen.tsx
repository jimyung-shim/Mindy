import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { colors } from '../../theme/colors';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { AppTabParamList } from '../../navigation/types';
import Header from '../../components/common/Header';

type Props = BottomTabScreenProps<AppTabParamList, 'ReserveTab'>;

export default function ReservationScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <Header title='예약'></Header>
      <View style={styles.box}>
        <Text style={styles.muted}>예약 기능은 곧 제공됩니다.</Text>
      </View>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  box: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  muted: {
    color: colors.textMuted,
    textAlign: 'center',
  },
});
