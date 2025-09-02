import React, { useState } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import CategoryGrid from '../../components/CategoryGrid';
import SelectionHint from '../../components/SelectionHint';
import PrimaryButton from '../../components/PrimaryButton';
import { CATEGORIES, CategoryKey } from '../../services/persona';
// 추후 서버 연동:
// import { assignPersona } from '../../services/api';

const MAX = 4;

export default function PersonaSelectScreen({ navigation }: any) {
    const [selected, setSelected] = useState<CategoryKey[]>([]);

    const onSubmit = async () => {
    // TODO: 서버 POST /persona/assign 연동
    // const result = await assignPersona(selected);
    // navigation.navigate('Mypage', { persona: result });
    navigation.goBack(); // 임시
    };

    return (
        <ScreenContainer title="상담 카테고리 선택" subtitle={`최대 ${MAX}개까지 선택해 주세요`}>
            <CategoryGrid items={CATEGORIES as any} selected={selected} maxSelection={MAX} onChange={setSelected} />
            <SelectionHint count={selected.length} max={MAX} helper="고민되는 주제를 골라 주세요" />
            <PrimaryButton title="계속" onPress={onSubmit} disabled={selected.length === 0} />
        </ScreenContainer>
    );
}
