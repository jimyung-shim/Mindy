import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonaSelectScreen from '../screens/persona/PersonaSelectScreen';
import TabNavigator from './TabNavigator';
import type { AppStackParamList } from './types';
import { usePersona } from '../stores/personaStore';
import ChatScreen from '../screens/chat/ChatScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    const hasPersona = usePersona((s) => !!s.personaKey);
    return (
        <Stack.Navigator initialRouteName={hasPersona ? 'Tabs' : 'PersonaSelect'}>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="PersonaSelect" component={PersonaSelectScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Chat" component={ChatScreen}/>
        </Stack.Navigator>
    );
}