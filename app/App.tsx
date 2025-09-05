import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import MyPageScreen from './src/screens/account/MyPageScreen';
import PersonaSelectScreen from './src/screens/persona/PersonaSelectScreen';
import { useAuth } from './src/stores/authStore';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from './src/screens/home/HomeScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import ReservationScreen from './src/screens/reservation/ReservationScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './src/theme/colors';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  PersonaSelect: undefined;
  // 추후: ProfileEdit, Settings 등 추가
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            HomeTab: 'home-outline',
            ChatTab: 'chatbubble-ellipses-outline',
            ReserveTab: 'calendar-outline',
            MypageTab: 'person-circle-outline',
          };
          const name = map[route.name] ?? 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name="ChatTab" component={ChatScreen} options={{ title: '채팅' }} />
      <Tab.Screen name="ReserveTab" component={ReservationScreen} options={{ title: '예약' }} />
      <Tab.Screen name="MypageTab" component={MyPageScreen} options={{ title: '마이페이지' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Tabs" component={Tabs} />
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