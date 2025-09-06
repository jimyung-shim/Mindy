import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuth } from '../stores/authStore';

export default function RootNavigator() {
    const accessToken = useAuth((s) => s.accessToken);
    return (
        <NavigationContainer>
            {accessToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}