import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import CategoryChip from './CategoryChip';
import type { CategoryKey } from '../services/persona';

export type CategoryItem = { key: CategoryKey; label: string };

type Props = {
    items: CategoryItem[];
    selected: CategoryKey[];           // 제어형
    maxSelection?: number;             // 기본 4
    onChange: (next: CategoryKey[]) => void;
};

export default function CategoryGrid({
    items, selected, maxSelection = 4, onChange,
}: Props) {
    const set = useMemo(() => new Set(selected), [selected]);

    const toggle = (k: CategoryKey) => {
        const has = set.has(k);
        if (has) return onChange(selected.filter((x) => x !== k));
        if (selected.length >= maxSelection) return;
        onChange([...selected, k]);
    };

    return (
        <View style={styles.wrap}>
        {items.map((it) => (
            <CategoryChip
            key={it.key}
            label={it.label}
            selected={set.has(it.key)}
            onPress={() => toggle(it.key)}
            />
        ))}
        </View>
    );
    }

const styles = StyleSheet.create({
    wrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
