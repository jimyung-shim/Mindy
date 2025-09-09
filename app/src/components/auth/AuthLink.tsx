import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  text: string;
  linkText: string;
  onPress: () => void;
};

export default function AuthLink({ text, linkText, onPress }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.link}> {linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  muted: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '700' },
});