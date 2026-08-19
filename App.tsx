import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useStore } from './src/store/store';

export default function App() {
  const loadHistory = useStore((s) => s.loadHistory);
  const loadSubscription = useStore((s) => s.loadSubscription);

  useEffect(() => {
    loadHistory();
    loadSubscription();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
