import { useEffect } from 'react';
import { Alert } from 'react-native';
import { onSurveyPrompt, offSurveyPrompt } from '../../services/socket';
import { useNavigation } from '@react-navigation/native';

export function useSurveyPromptListener(): void {
  const navigation = useNavigation<any>();
  useEffect(() => {
    const handler = (payload: { conversationId: string; reason: 'risk'|'turns'; draftId: string }) => {
      Alert.alert(
        '문진표 안내',
        payload.reason === 'risk'
          ? '상담 내용에 따라 문진표를 작성해 주세요.'
          : '대화가 일정 횟수에 도달했습니다. 문진표를 작성해 주세요.',
        [
          { text: '나중에', style: 'cancel' },
          { text: '작성하기', onPress: () => navigation.navigate('Survey', { draftId: payload.draftId }) },
        ],
      );
    };
    onSurveyPrompt(handler);
    return () => offSurveyPrompt(handler);
  }, [navigation]);
}
