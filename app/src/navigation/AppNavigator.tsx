// app/src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonaSelectScreen from '../screens/persona/PersonaSelectScreen';
import TabNavigator from './TabNavigator';
import type { AppStackParamList } from './types';
import ChatScreen from '../screens/chat/ChatScreen';
import SurveyScreen from '../screens/survey/SurveyScreen';
import SurveyListScreen from '../screens/survey/SurveyListScreen';
import CounselorDetailScreen from '../screens/reservation/CounselorDetailScreen'; // 추가
import { useAuth } from '../stores/authStore';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    const hydrated = useAuth((s) => s.hydrated);
    const hasSession = useAuth((s) => !!s.userId);

    if (!hydrated) return null; // or a loading screen

    return (
        <Stack.Navigator initialRouteName={hasSession ? 'Tabs' : 'PersonaSelect'}>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="PersonaSelect" component={PersonaSelectScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Chat" component={ChatScreen}/>
            <Stack.Screen name="Survey" component={SurveyScreen} options={{ title: '문진표' }} />
            <Stack.Screen name="SurveyList" component={SurveyListScreen} />
            <Stack.Screen name="CounselorDetail" component={CounselorDetailScreen} />
        </Stack.Navigator>
    );
}