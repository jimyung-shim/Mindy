import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
//import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

type Props = {
  onPress: () => void;
};

export default function ReportShortcut({ onPress }: Props) {
  return (
    <View style={{height: 120}}>
    <Text style={styles.shortcutLabel}>AI CBT 기반, 마음 분석소 🏠</Text>
    <TouchableOpacity style={styles.reportShortcut} onPress={onPress}>
      
      <View style={styles.shortcutIconWrapper}>
        <Image source={require('../../../../assets/icons/report.png')} style={styles.icon} />
        <Text style={styles.reportButtonText}>마음 리포트</Text>
      </View>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shortcutLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
  },
  reportShortcut: {
    flex: 1,
    backgroundColor: '#f5f6fb',
    borderRadius: 20,
    padding: 16,
  },
  shortcutIconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  reportButtonText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 20
  },
  icon: {
    width: 48,
    height: 48,
  }
});