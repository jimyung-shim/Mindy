import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ReservationScreen from '../screens/reservation/ReservationScreen';
import MyPageScreen from '../screens/account/MyPageScreen';
import { colors } from '../theme/colors';
import type { AppTabParamList } from './types';
import Header from '../components/common/Header';
const Tab = createBottomTabNavigator<AppTabParamList>();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                header: ({ options }) => <Header title={options.title ?? route.name} />,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarIcon: ({ color, size }) => {
                    const map: Record<string, keyof typeof Ionicons.glyphMap> = {
                        HomeTab: 'home-outline',
                        ChatListTab: 'chatbubble-ellipses-outline',
                        ReserveTab: 'calendar-outline',
                        MypageTab: 'person-circle-outline',
                    };
                    const name = map[route.name] ?? 'ellipse-outline';
                    return <Ionicons name={name} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: '홈' }} />
            <Tab.Screen name="ChatListTab" component={ChatListScreen} options={{ title: '채팅' }} />
            <Tab.Screen name="ReserveTab" component={ReservationScreen} options={{ title: '예약' }} />
            <Tab.Screen name="MypageTab" component={MyPageScreen} options={{ title: '마이페이지' }} />
        </Tab.Navigator>
    );
}