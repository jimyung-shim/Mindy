import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import AuthInput from '../../components/AuthInput';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { isEmail, minLen } from '../../utils/validators';
import { login } from '../../services/api';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStack = {
  Persona: undefined; // existing
  Login: undefined;
  Signup: undefined;
  Chat: { personaId?: string; personaLabel?: string; personaImage?: any } | undefined;
};

type Props = NativeStackScreenProps<RootStack, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!isEmail(email)) e.email = '유효한 이메일을 입력하세요';
    if (!minLen(password, 8)) e.password = '비밀번호는 8자 이상';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const r = await login({ email, password });
      // TODO: store tokens securely (expo-secure-store)
      Alert.alert('로그인 성공', '환영합니다!');
      navigation.replace('Persona');
    } catch (err: any) {
      Alert.alert('로그인 실패', err?.message ?? '서버 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer title=" " subtitle=" ">
      <AuthInput label="Email" value={email} onChangeText={setEmail} placeholder="이메일 입력" keyboardType="email-address" error={errors.email} />
      <AuthInput label="비밀번호" value={password} onChangeText={setPassword} placeholder="비밀번호 입력" secureTextEntry error={errors.password} />
      <PrimaryButton title={loading ? '로그인 중…' : '로그인'} onPress={onSubmit} loading={loading} />

      <View style={styles.row}>
        <Text style={styles.muted}>계정이 없나요?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}> 회원가입</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  muted: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '700' },
});