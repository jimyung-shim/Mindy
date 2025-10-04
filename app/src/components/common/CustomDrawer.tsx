import React, { useEffect, useRef } from 'react';
import { Modal, View, StyleSheet, Pressable, Animated, Dimensions, SafeAreaView } from 'react-native';
import { useDrawerStore } from '../../stores/drawerStore';
import DrawerContent from '../../navigation/DrawerContent'; // 컨텐츠는 여기에 표시됩니다

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export default function CustomDrawer() {
  const { isOpen, closeDrawer } = useDrawerStore();
  const animatedValue = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, animatedValue]);

  return (
    <Modal visible={isOpen} transparent animationType="none">
      <View style={styles.container}>
        <Pressable style={styles.backdrop} onPress={closeDrawer} />
        <Animated.View style={[styles.drawer, { transform: [{ translateX: animatedValue }] }]}>
          <DrawerContent />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    elevation: 5,
  },
});