import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuth } from '../stores/authStore';
import { initSocket, joinUserRoom } from '../services/socket';


export default function RootNavigator() {
    const accessToken = useAuth((s) => s.accessToken);
    const userId = useAuth((s) => s.userId);
    useEffect(() => {
        if (accessToken && userId) {
            // 토큰으로 소켓을 초기화(연결)합니다.
            initSocket(accessToken);
            // 서버에 내 고유 ID로 만들어진 방에 참가한다고 알립니다.
            joinUserRoom(userId); // accessToken이나 userId가 변경되면 실행
        }
    }, [accessToken, userId]);
    return (
        <NavigationContainer>
            {accessToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}