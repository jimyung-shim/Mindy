import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryButton({ title, onPress, disabled, loading }: Props) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity style={[styles.btn, isDisabled && styles.btnDisabled]} activeOpacity={0.8} onPress={onPress} disabled={isDisabled}>
      {loading ? <ActivityIndicator /> : <Text style={styles.title}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  title: { color: '#fff', fontWeight: '700', fontSize: 16 },
});