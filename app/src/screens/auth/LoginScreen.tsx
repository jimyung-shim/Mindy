import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { useAuth } from '../../stores/authStore';
import ControlledAuthInput from '../../components/form/ControlledAuthInput';
import { loginSchema, type LoginInput } from '../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function LoginScreen({ navigation }: any) {
  const { login: doLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await doLogin(data.email, data.password);
      Alert.alert('로그인 성공', '환영합니다!');
      // 내비게이션 전환은 RootNavigator가 accessToken 변화를 감지해서 처리합니다.
    } catch (err: any) {
      Alert.alert('로그인 실패', err?.message ?? '서버 오류');
    } finally {
      setLoading(false);
    }
  });

  return (
    <ScreenContainer title=" " subtitle=" ">
      <ControlledAuthInput control={control} name="email" label="Email" placeholder="이메일 입력" keyboardType="email-address" />
      <ControlledAuthInput control={control} name="password" label="비밀번호" placeholder="비밀번호 입력" secureTextEntry />

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