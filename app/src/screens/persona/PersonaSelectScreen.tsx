import React, { useState } from 'react';
import { Alert } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import CategoryGrid from '../../components/CategoryGrid';
import SelectionHint from '../../components/SelectionHint';
import PrimaryButton from '../../components/PrimaryButton';
import { CATEGORIES, CategoryKey } from '../../services/persona';
import { assignPersona } from '../../services/api';
// 추후 서버 연동:
// import { assignPersona } from '../../services/api';

const MAX = 4;

export default function PersonaSelectScreen({ navigation }: any) {
    const [selected, setSelected] = useState<CategoryKey[]>([]);
    const [loading, setLoading] = useState(false);


    const onSubmit = async () => {
        try {
            setLoading(true);
            const result = await assignPersona(selected);

            // 결과를 다음 화면으로 넘기기 (예: 마이페이지/챗봇으로 전달)
            navigation.navigate('Mypage', { persona: result });

            // 또는 임시 Alert
            Alert.alert('배정 완료', `${result.personaLabel}\n${result.reason}`);
        } catch (e: any) {
            Alert.alert('오류', e?.message ?? '배정 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title="상담 카테고리 선택" subtitle={`최대 ${MAX}개까지 선택해 주세요`}>
            <CategoryGrid 
                items={CATEGORIES as any}
                selected={selected}
                maxSelection={MAX}
                onChange={setSelected}
            />
            <SelectionHint count={selected.length} max={MAX} helper="고민되는 주제를 골라 주세요" />
            <PrimaryButton 
                title={loading ? '처리 중...' : '계속'}
                onPress={onSubmit} 
                disabled={selected.length === 0 || loading} 
                loading={loading}
            />
        </ScreenContainer>
    );
}
