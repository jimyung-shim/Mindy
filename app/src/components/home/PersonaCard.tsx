import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { usePersona } from '../../stores/personaStore';
import { colors } from '../../theme/colors';

export default function PersonaCard() {
  const { personaLabel, imageUrl, reason } = usePersona();

  return (
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
          페르소나를 배정받고 상담을 시작해 보세요.
        </Text>
      )}
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
});