import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuth } from '../stores/authStore';
import { initializeSocket, onSurveyPrompt, offSurveyPrompt } from '../services/socket';
import { Alert } from 'react-native';

function AppOrAuth() {
    const accessToken = useAuth((s) => s.accessToken);
    const userId = useAuth((s) => s.userId);
    const navigation = useNavigation<any>();

    useEffect(() => {
        if (accessToken && userId) {
            // 1. 소켓 연결 및 방 참가
            initializeSocket(accessToken, userId);
            // 2. 문진표 이벤트 핸들러 정의
            const handler = (payload: { draftId: string }) => {
                Alert.alert(
                    '문진표 안내',
                    '대화 내용을 바탕으로 문진표 작성이 필요합니다.',
                    [
                        { text: '나중에', style: 'cancel' },
                        { text: '작성하기', onPress: () => navigation.navigate('Survey', { draftId: payload.draftId }) },
                    ],
                );
            };

            // 3. 이벤트 리스너 등록
            onSurveyPrompt(handler);

            // 4. 컴포넌트가 사라지거나 재연결될 때 리스너 정리
            return () => {
                offSurveyPrompt(handler);
            };
        }
    }, [accessToken, userId, navigation]);

    return accessToken ? <AppNavigator /> : <AuthNavigator />;
}

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <AppOrAuth />
        </NavigationContainer>
    );
}