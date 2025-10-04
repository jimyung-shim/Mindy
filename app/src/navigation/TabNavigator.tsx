import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ReservationScreen from '../screens/reservation/ReservationScreen';
import MyPageScreen from '../screens/account/MyPageScreen';
import { colors } from '../theme/colors';
import type { AppTabParamList } from './types';
import Header from '../components/common/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator<AppTabParamList>();

export default function TabNavigator() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions={({ route }) => ({
                //header: ({ options }) => <Header title={options.title ?? route.name} />,
                swipeEnabled:true,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarIndicatorStyle: { // 상단에 표시되는 인디케이터 라인을 숨깁니다.
                    height: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    margin: 0,
                },
                tabBarIconStyle: {
                    marginTop: -4, // 아이콘과 라벨 사이 간격 조정
                },
                tabBarStyle: {
                    backgroundColor: '#fff', // 탭 바 배경색
                    
                },
                tabBarIcon: ({ color }) => {
                    const map: Record<string, keyof typeof Ionicons.glyphMap> = {
                        HomeTab: 'home',
                        ChatListTab: 'chatbubble-ellipses',
                        ReserveTab: 'calendar',
                        MypageTab: 'person-circle',
                    };
                    const name = map[route.name] ?? 'ellipse-outline';
                    return <Ionicons name={name} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} options=  {{ title:"홈" } } />
            <Tab.Screen name="ChatListTab" component={ChatListScreen} options={{ title: '채팅' }} />
            <Tab.Screen name="ReserveTab" component={ReservationScreen} options={{ title: '예약' }} />
            <Tab.Screen name="MypageTab" component={MyPageScreen} options={{ title: '마이페이지' }} />
        </Tab.Navigator>
        </SafeAreaView>
    );
}