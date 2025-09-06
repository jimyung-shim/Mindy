import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from './src/stores/authStore';
import RootNavigator from './src/navigation/RootNavigator';


function Splash() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}


export default function App() {
  const hydrate = useAuth((s) => s.hydrate);
  const hydrated = useAuth((s) => s.hydrated);


  useEffect(() => {
    void hydrate();
  }, [hydrate]);


  if (!hydrated) return <Splash />;
  return <RootNavigator />;
}