import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import MyPageScreen from './src/screens/account/MyPageScreen';
import PersonaSelectScreen from './src/screens/persona/PersonaSelectScreen';
import { useAuth } from './src/stores/authStore';
import { View, ActivityIndicator } from 'react-native';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  Mypage: undefined;
  PersonaSelect: undefined;
  // 추후: ProfileEdit, Settings 등 추가
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Mypage" component={MyPageScreen} />
      <AppStack.Screen name="PersonaSelect" component={PersonaSelectScreen} />
      {/* App 전용 스크린들을 여기에 추가 */}
    </AppStack.Navigator>
  );
}

function Splash() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}

export default function App() {
  const hydrate = useAuth((s) => s.hydrate);
  const hydrated = useAuth((s) => s.hydrated);
  const accessToken = useAuth((s) => s.accessToken);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!hydrated) return <Splash />;

  return (
    <NavigationContainer>
      {accessToken ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}