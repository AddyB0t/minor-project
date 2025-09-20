// Detailed plant information screen
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PlantDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get plant data from route params (when implemented)
  const { plant, plantData } = route.params || { 
    plant: { name: 'Tomato', water_need: 'Moderate', sunlight: 'Full Sun', soil_ph: '6.0-6.8', cost_per_acre: '1500' },
    plantData: { emoji: '🍅', color: 'from-red-400 to-pink-500' }
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8 items-center">
          <View className={`w-24 h-24 rounded-full bg-gradient-to-r ${plantData.color} items-center justify-center mb-4`}>
            <Text className="text-5xl">{plantData.emoji}</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">{plant.name}</Text>
          <Text className="text-gray-600 text-lg">Complete Growing Guide</Text>
        </View>

        {/* Growing Information */}
        <View className="space-y-4 mb-8">
          <View className="bg-white rounded-2xl p-4 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">💧</Text>
              <Text className="text-xl font-semibold text-gray-800">Water Requirements</Text>
            </View>
            <Text className="text-gray-600 leading-6">{plant.water_need}</Text>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">☀️</Text>
              <Text className="text-xl font-semibold text-gray-800">Sunlight Needs</Text>
            </View>
            <Text className="text-gray-600 leading-6">{plant.sunlight}</Text>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">🧪</Text>
              <Text className="text-xl font-semibold text-gray-800">Soil pH</Text>
            </View>
            <Text className="text-gray-600 leading-6">{plant.soil_ph}</Text>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">💰</Text>
              <Text className="text-xl font-semibold text-gray-800">Investment</Text>
            </View>
            <Text className="text-2xl font-bold text-green-600">${plant.cost_per_acre} per acre</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity 
            className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg"
            onPress={() => navigation.navigate('Chat')}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-2xl mr-3">🤖</Text>
              <Text className="text-white font-semibold text-lg">Ask AI about {plant.name}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg"
            onPress={() => navigation.goBack()}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-2xl mr-3">←</Text>
              <Text className="text-white font-semibold text-lg">Back to Plants</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}