import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PersonaCard from '../components/home/PersonaCard';
import MyInfoCard from '../components/MyInfoCard';
import { colors } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DrawerContent() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <MyInfoCard />
        <PersonaCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    gap: 14,
  },
});