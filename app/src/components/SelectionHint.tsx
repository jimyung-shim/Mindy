import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = { count: number; max: number; helper?: string };

export default function SelectionHint({ count, max, helper }: Props) {
    return (
        <View style={styles.wrap}>
        {helper ? <Text style={styles.helper}>{helper}</Text> : <View />}
        <Text style={styles.counter}>{count} / {max}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -6, marginBottom: 8 },
    helper: { color: colors.textMuted },
    counter: { color: colors.textMuted, fontWeight: '600' },
});
