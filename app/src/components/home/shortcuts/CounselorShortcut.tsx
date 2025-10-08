import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
//import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onPress: () => void;
};

export default function CounselorShortcut({ onPress }: Props) {
  return (
    <View>
    <Text style={styles.shortcutLabel}>내 맘에 쏙- ♥{"\n"}심리 상담 예약하기</Text>
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={['#958bf4', '#b5aff6']} // 연한 보라색 -> 더 연한색
        style={styles.gradient}
      >
        <View style={styles.shortcutIconWrapper}>
          
          <Image source={require('../../../../assets/icons/search.png')} style={styles.icon} />
          <Text style={styles.counslerButtonText}>상담사 찾기</Text>
        </View>
      </LinearGradient>
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
  counselorShortcut: {
    flex: 1,
    backgroundColor: '#eef0ff',
    borderRadius: 20,
    padding: 16,
  },
  shortcutIconWrapper: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    width: 90,
    height: 70,
  },
  counslerButtonText: {
    position: 'absolute',
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize:19.666,
  },
  gradient: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    borderRadius: 20,
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf:'flex-end',
  },
});