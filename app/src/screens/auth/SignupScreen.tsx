import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import AuthInput from '../../components/AuthInput';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { isEmail, minLen } from '../../utils/validators';
import { signup } from '../../services/api';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStack = {
  Signup: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStack, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; nickname?: string; password?: string; confirm?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!isEmail(email)) e.email = '유효한 이메일을 입력하세요';
    if (!minLen(nickname, 2)) e.nickname = '닉네임은 2자 이상';
    if (!minLen(password, 8)) e.password = '비밀번호는 8자 이상';
    if (password !== confirm) e.confirm = '비밀번호가 일치하지 않습니다';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await signup({ email, password, nickname });
      Alert.alert('회원가입 완료', '로그인해 주세요');
      navigation.replace('Login');
    } catch (err: any) {
      Alert.alert('회원가입 실패', err?.message ?? '서버 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer title="회원가입" subtitle="계정을 만들어 시작해 보세요">
      <AuthInput label="Email" value={email} onChangeText={setEmail} placeholder="이메일 입력" keyboardType="email-address" error={errors.email} />
      <AuthInput label="아이디" value={nickname} onChangeText={setNickname} placeholder="아이디 입력 (2자 이상)" autoCapitalize="none" error={errors.nickname} />
      <AuthInput label="비밀번호" value={password} onChangeText={setPassword} placeholder="비밀번호 입력 (8자 이상)" secureTextEntry error={errors.password} />
      <AuthInput label="비밀번호 확인" value={confirm} onChangeText={setConfirm} placeholder="비밀번호 재입력" secureTextEntry error={errors.confirm} />
      <PrimaryButton title={loading ? '처리 중…' : '회원가입'} onPress={onSubmit} loading={loading} />

      <View style={styles.row}>
        <Text style={styles.muted}>이미 계정이 있나요?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}> 로그인</Text>
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