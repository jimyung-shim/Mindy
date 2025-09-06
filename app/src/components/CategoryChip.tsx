import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
    label: string;
    selected?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    onPress?: () => void;
};

export default function CategoryChip({
    label, selected, disabled, style, textStyle, onPress,
}: Props) {
    return (
    <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: !!selected, disabled: !!disabled }}
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [
            styles.chip,
            selected && styles.chipOn,
            disabled && styles.chipDisabled,
            pressed && !disabled && styles.chipPressed,
            style,
        ]}
    >
    <Text style={[styles.text, selected && styles.textOn, textStyle]}>{label}</Text>
    </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 18, borderWidth: 1, borderColor: colors.border,
        backgroundColor: '#f6f7f9',
        marginRight: 8, marginBottom: 8,
    },
    chipOn: { backgroundColor: '#eef0ff', borderColor: colors.primary },
    chipPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
    chipDisabled: { opacity: 0.5 },
    text: { color: '#555', fontSize: 14 },
    textOn: { color: colors.primary, fontWeight: '700' },
});
