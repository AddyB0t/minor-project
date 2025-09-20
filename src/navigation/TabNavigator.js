// Bottom tab navigator for main app sections
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

// Import screens (will be created next)
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import PlantsScreen from '../screens/PlantsScreen';

const Tab = createBottomTabNavigator();

function SettingsScreen() {
  return (
    <View className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 justify-center items-center">
      <Text className="text-3xl">⚙️</Text>
      <Text className="text-xl font-bold text-gray-800 mt-2">Settings</Text>
      <Text className="text-gray-600 mt-1">Coming Soon!</Text>
    </View>
  );
}

export default function TabNavigator() {
  const tabBarOptions = {
    tabBarStyle: {
      backgroundColor: 'white',
      borderTopColor: '#E5E7EB',
      borderTopWidth: 1,
      paddingTop: 8,
      paddingBottom: 8,
      height: 70,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    tabBarActiveTintColor: '#059669',
    tabBarInactiveTintColor: '#9CA3AF',
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
    },
    headerStyle: {
      backgroundColor: '#059669',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 18,
    },
  };

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: '🌾 Smart Farm',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: '🤖 AI Assistant',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🤖</Text>
          ),
          tabBarLabel: 'AI Chat',
        }}
      />
      <Tab.Screen 
        name="Plants" 
        component={PlantsScreen}
        options={{
          title: '🌱 Plant Database',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🌱</Text>
          ),
          tabBarLabel: 'Plants',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: '⚙️ Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>⚙️</Text>
          ),
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}