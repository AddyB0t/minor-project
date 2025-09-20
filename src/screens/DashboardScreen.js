// Dashboard screen for smart agriculture app
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const stats = [
    { title: 'Temperature', value: '24°C', icon: '🌡️', color: 'from-orange-400 to-red-500' },
    { title: 'Humidity', value: '65%', icon: '💧', color: 'from-blue-400 to-cyan-500' },
    { title: 'Soil Moisture', value: '78%', icon: '🌱', color: 'from-green-400 to-emerald-500' },
    { title: 'Light Level', value: '85%', icon: '☀️', color: 'from-yellow-400 to-orange-500' },
  ];

  const navigateToChat = () => {
    navigation.navigate('Chat');
  };

  const navigateToPlants = () => {
    navigation.navigate('Plants');
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-green-50 to-blue-50">
      <Animated.View
        className="p-6"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">🌾 Smart Farm</Text>
          <Text className="text-gray-600 text-lg">Monitor your crops in real-time</Text>
        </View>

        {/* Stats Grid */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-700 mb-4">Current Conditions</Text>
          <View className="flex-row flex-wrap justify-between">
            {stats.map((stat, index) => (
              <TouchableOpacity 
                key={index} 
                className="bg-white rounded-2xl p-4 mb-4 shadow-lg" 
                style={{ width: (width - 48) / 2 - 8 }}
                onPress={() => {
                  // Future: Navigate to sensor detail screen
                  console.log(`Pressed ${stat.title}`);
                }}
              >
                <View className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} items-center justify-center mb-3`}>
                  <Text className="text-2xl">{stat.icon}</Text>
                </View>
                <Text className="text-gray-600 text-sm mb-1">{stat.title}</Text>
                <Text className="text-2xl font-bold text-gray-800">{stat.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</Text>
          <View className="space-y-3">
            <TouchableOpacity 
              className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg"
              onPress={navigateToChat}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🤖</Text>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-lg">Chat with AI</Text>
                  <Text className="text-green-100">Get farming advice</Text>
                </View>
                <Text className="text-white text-xl">→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg"
              onPress={navigateToPlants}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🌱</Text>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-lg">Plant Database</Text>
                  <Text className="text-blue-100">Learn about crops</Text>
                </View>
                <Text className="text-white text-xl">→</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}