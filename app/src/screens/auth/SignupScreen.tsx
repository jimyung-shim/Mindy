import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ControlledAuthInput from '../../components/form/ControlledAuthInput';
import { signupSchema, type SignupInput } from '../../schemas/auth';
import { signup } from '../../services/api';

export default function SignupScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', nickname: '', password: '', confirm: '' },
  });

  const password = watch('password');
  const confirm = watch('confirm');
  const isMatch = password.length > 0 && password === confirm;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await signup({ email: data.email, password: data.password, nickname: data.nickname });
      Alert.alert('회원가입 완료', '로그인해 주세요');
      navigation.replace('Login');
    } catch (err: any) {
      Alert.alert('회원가입 실패', err?.message ?? '서버 오류');
    } finally {
      setLoading(false);
    }
  });

  return (
    <ScreenContainer title="회원가입" subtitle="계정을 만들어 시작해 보세요">
      <ControlledAuthInput control={control} name="email" label="Email" placeholder="이메일 입력" keyboardType="email-address" />
      <ControlledAuthInput control={control} name="nickname" label="아이디" placeholder="아이디 입력 (2자 이상)" />
      <ControlledAuthInput control={control} name="password" label="비밀번호" placeholder="비밀번호 입력 (8자 이상)" secureTextEntry />
      <ControlledAuthInput control={control} name="confirm" label="비밀번호 확인" placeholder="비밀번호 재입력" secureTextEntry />

      {confirm.length > 0 && (
        <Text style={[styles.matchMsg, isMatch ? styles.matchOk : styles.matchBad]}>
            {isMatch ? '비밀번호 일치' : '비밀번호 불일치'}
        </Text>
      )}

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
  matchMsg: { marginTop: -6, marginBottom: 8, fontSize: 12 },
  matchOk: { color: '#10b981', fontWeight: '600' },
  matchBad: { color: '#ef4444', fontWeight: '600' },
});