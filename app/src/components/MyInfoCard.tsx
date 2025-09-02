import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { getMe } from '../services/api';
import { useAuth } from '../stores/authStore';
import { Feather } from '@expo/vector-icons';

export default function MyInfoCard() {
  const nickname = useAuth((s) => s.nickname);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ userId: string | null; email: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getMe();
      setMe(data);
    } catch (e: any) {
      setError(e?.message ?? '내 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>내 정보</Text>
        <TouchableOpacity onPress={load} accessibilityLabel="새로고침">
          <Feather name="refresh-ccw" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.infoWrap}>
          <Row label="닉네임" value={nickname ?? '-'} />
          <Row label="이메일" value={me?.email ?? '-'} />
          <Row label="User ID" value={me?.userId ?? '-'} mono />
        </View>
      )}
    </View>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, mono && styles.mono]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  center: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.danger, fontSize: 13 },
  infoWrap: { gap: 8, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: colors.textMuted, fontSize: 13 },
  value: { color: colors.text, fontSize: 14, maxWidth: '70%' },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: undefined }) },
});
