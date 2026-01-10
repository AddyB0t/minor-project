// Main app navigator with React Navigation
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import TabNavigator from './TabNavigator';

// Shadcn dark theme
const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#22C55E',
    background: '#09090B',
    card: '#18181B',
    text: '#FAFAFA',
    border: '#27272A',
    notification: '#22C55E',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <TabNavigator />
    </NavigationContainer>
  );
}
