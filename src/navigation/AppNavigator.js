// Main app navigator with React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import TabNavigator from './TabNavigator';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <TabNavigator />
    </NavigationContainer>
  );
}