// Plants screen for plant database
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPlantInfo } from '../database';

const { width } = Dimensions.get('window');

export default function PlantsScreen() {
  const navigation = useNavigation();
  const [plantInfo, setPlantInfo] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const plants = [
    { name: 'Tomato', emoji: '🍅', color: 'from-red-400 to-pink-500' },
    { name: 'Wheat', emoji: '🌾', color: 'from-yellow-400 to-amber-500' },
    { name: 'Rice', emoji: '🌾', color: 'from-green-400 to-teal-500' },
    { name: 'Corn', emoji: '🌽', color: 'from-yellow-500 to-orange-500' },
    { name: 'Potato', emoji: '🥔', color: 'from-brown-400 to-amber-600' },
  ];

  const showPlant = async (plantName) => {
    setSelectedPlant(plantName);
    const info = await getPlantInfo(plantName);
    setPlantInfo(info);
    
    // Future: Navigate to plant detail screen
    // navigation.navigate('PlantDetail', { plant: info, plantData: plants.find(p => p.name === plantName) });
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50">
      <Animated.View className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">🌱 Plant Database</Text>
          <Text className="text-gray-600 text-lg">Discover optimal growing conditions</Text>
        </View>

        {/* Plant Grid */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-700 mb-4">Select a Plant</Text>
          <View className="flex-row flex-wrap justify-between">
            {plants.map((plant, index) => (
              <TouchableOpacity
                key={index}
                className={`bg-white rounded-2xl p-4 mb-4 shadow-lg ${selectedPlant === plant.name ? 'ring-2 ring-green-500' : ''}`}
                style={{ width: (width - 48) / 2 - 8 }}
                onPress={() => showPlant(plant.name)}
              >
                <View className={`w-16 h-16 rounded-full bg-gradient-to-r ${plant.color} items-center justify-center mb-3 mx-auto`}>
                  <Text className="text-3xl">{plant.emoji}</Text>
                </View>
                <Text className="text-center font-semibold text-gray-800 text-lg">{plant.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Plant Details */}
        {plantInfo && (
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center mb-4">
              <Text className="text-3xl mr-3">
                {plants.find(p => p.name === plantInfo.name)?.emoji}
              </Text>
              <View>
                <Text className="text-2xl font-bold text-gray-800">{plantInfo.name}</Text>
                <Text className="text-gray-600">Growing Guide</Text>
              </View>
            </View>

            <View className="space-y-4">
              <View className="flex-row items-center bg-blue-50 p-3 rounded-xl">
                <Text className="text-2xl mr-3">💧</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-700">Water Needs</Text>
                  <Text className="text-gray-600">{plantInfo.water_need}</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-yellow-50 p-3 rounded-xl">
                <Text className="text-2xl mr-3">☀️</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-700">Sunlight</Text>
                  <Text className="text-gray-600">{plantInfo.sunlight}</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-green-50 p-3 rounded-xl">
                <Text className="text-2xl mr-3">🧪</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-700">Soil pH</Text>
                  <Text className="text-gray-600">{plantInfo.soil_ph}</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-purple-50 p-3 rounded-xl">
                <Text className="text-2xl mr-3">💰</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-700">Cost per Acre</Text>
                  <Text className="text-gray-600 text-lg font-bold text-green-600">${plantInfo.cost_per_acre}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}