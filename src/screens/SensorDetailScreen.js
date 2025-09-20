// Detailed sensor information screen
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function SensorDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get sensor data from route params (when implemented)
  const { sensorType, currentValue, icon, color } = route.params || { 
    sensorType: 'Temperature', 
    currentValue: '24°C', 
    icon: '🌡️', 
    color: 'from-orange-400 to-red-500' 
  };

  // Mock historical data
  const [historicalData] = useState([
    { time: '00:00', value: '22°C' },
    { time: '04:00', value: '20°C' },
    { time: '08:00', value: '24°C' },
    { time: '12:00', value: '28°C' },
    { time: '16:00', value: '26°C' },
    { time: '20:00', value: '24°C' },
  ]);

  const getRecommendation = (sensorType) => {
    const recommendations = {
      'Temperature': 'Optimal range for most crops is 20-25°C. Current temperature is ideal for plant growth.',
      'Humidity': 'Good humidity levels. Maintain between 60-70% for optimal plant health.',
      'Soil Moisture': 'Excellent soil moisture. Continue current watering schedule.',
      'Light Level': 'Great light exposure. Plants are getting sufficient sunlight for photosynthesis.'
    };
    return recommendations[sensorType] || 'Monitor this parameter regularly for optimal crop health.';
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8 items-center">
          <View className={`w-24 h-24 rounded-full bg-gradient-to-r ${color} items-center justify-center mb-4`}>
            <Text className="text-5xl">{icon}</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">{sensorType}</Text>
          <Text className="text-gray-600 text-lg">Current Reading: {currentValue}</Text>
        </View>

        {/* Current Status */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Current Status</Text>
          <View className="flex-row items-center">
            <View className={`w-4 h-4 rounded-full bg-green-500 mr-3`}></View>
            <Text className="text-gray-600 flex-1">Normal Range</Text>
            <Text className="text-2xl font-bold text-green-600">{currentValue}</Text>
          </View>
        </View>

        {/* Historical Data */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">24-Hour History</Text>
          <View className="space-y-3">
            {historicalData.map((data, index) => (
              <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">{data.time}</Text>
                <Text className="font-semibold text-gray-800">{data.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Text className="text-2xl mr-3">💡</Text>
            <Text className="text-xl font-semibold text-gray-800">AI Recommendation</Text>
          </View>
          <Text className="text-gray-600 leading-6">{getRecommendation(sensorType)}</Text>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity 
            className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg"
            onPress={() => navigation.navigate('Chat')}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-2xl mr-3">🤖</Text>
              <Text className="text-white font-semibold text-lg">Ask AI about {sensorType}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg"
            onPress={() => navigation.goBack()}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-2xl mr-3">←</Text>
              <Text className="text-white font-semibold text-lg">Back to Dashboard</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}