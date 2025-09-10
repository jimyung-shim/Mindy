import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuth } from '../stores/authStore';
import { initSocket, joinUserRoom, onSurveyPrompt, offSurveyPrompt } from '../services/socket';
import { Alert } from 'react-native';

export default function RootNavigator() {
    const accessToken = useAuth((s) => s.accessToken);
    const userId = useAuth((s) => s.userId);
    const navigation = useNavigation<any>(); // [!] 네비게이션 훅 호출

    useEffect(() => {
        if (accessToken && userId) {
            // 토큰으로 소켓을 초기화(연결)
            initSocket(accessToken);
            // 서버에 내 고유 ID로 만들어진 방에 참가한다고 알림
            joinUserRoom(userId); // accessToken이나 userId가 변경되면 실행

            // 문진표 이벤트 핸들러 정의
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

            onSurveyPrompt(handler);

            offSurveyPrompt(handler);
        }
    }, [accessToken, userId, navigation]);
    return (
        <NavigationContainer>
            {accessToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}