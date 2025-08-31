import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import MyPageScreen from './src/screens/account/MyPageScreen';
import { useAuth } from './src/stores/authStore';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Persona: undefined;
  Chat: undefined;
  Mypage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const hydrate = useAuth((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Mypage" component={MyPageScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}