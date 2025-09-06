import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonaSelectScreen from '../screens/persona/PersonaSelectScreen';
import TabNavigator from './TabNavigator';
import type { AppStackParamList } from './types';
import { usePersona } from '../stores/personaStore';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    const hasPersona = usePersona((s) => !!s.personaKey);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={hasPersona ? 'Tabs' : 'PersonaSelect'}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="PersonaSelect" component={PersonaSelectScreen} />
        </Stack.Navigator>
    );
}