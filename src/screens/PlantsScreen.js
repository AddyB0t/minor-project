// Plants screen for plant database
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPlantInfo } from '../database';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';

const { width } = Dimensions.get('window');

export default function PlantsScreen() {
  const navigation = useNavigation();
  const [plantInfo, setPlantInfo] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plantsData, setPlantsData] = useState([]);

  // Mock comprehensive plant data
  const mockPlantsData = [
    {
      name: 'Tomato',
      emoji: '🍅',
      category: 'Vegetable',
      waterNeed: 'High',
      sunlight: 'Full Sun',
      soilPh: '6.0-6.8',
      costPerAcre: 2500,
      growthDays: 75,
      yield: '25-30 tons/acre',
      status: 'Recommended'
    },
    {
      name: 'Wheat',
      emoji: '🌾',
      category: 'Grain',
      waterNeed: 'Medium',
      sunlight: 'Full Sun',
      soilPh: '6.0-7.0',
      costPerAcre: 1800,
      growthDays: 120,
      yield: '3-4 tons/acre',
      status: 'Popular'
    },
    {
      name: 'Rice',
      emoji: '🌾',
      category: 'Grain',
      waterNeed: 'Very High',
      sunlight: 'Full Sun',
      soilPh: '5.5-6.5',
      costPerAcre: 2200,
      growthDays: 150,
      yield: '4-5 tons/acre',
      status: 'High Yield'
    },
    {
      name: 'Corn',
      emoji: '🌽',
      category: 'Grain',
      waterNeed: 'High',
      sunlight: 'Full Sun',
      soilPh: '6.0-7.0',
      costPerAcre: 2000,
      growthDays: 90,
      yield: '6-8 tons/acre',
      status: 'Recommended'
    },
    {
      name: 'Potato',
      emoji: '🥔',
      category: 'Vegetable',
      waterNeed: 'Medium',
      sunlight: 'Partial Sun',
      soilPh: '5.0-6.0',
      costPerAcre: 2800,
      growthDays: 80,
      yield: '20-25 tons/acre',
      status: 'Popular'
    },
    {
      name: 'Sugarcane',
      emoji: '🎋',
      category: 'Cash Crop',
      waterNeed: 'Very High',
      sunlight: 'Full Sun',
      soilPh: '6.5-7.5',
      costPerAcre: 3500,
      growthDays: 365,
      yield: '80-100 tons/acre',
      status: 'High Profit'
    },
    {
      name: 'Cotton',
      emoji: '🌿',
      category: 'Fiber',
      waterNeed: 'Medium',
      sunlight: 'Full Sun',
      soilPh: '6.0-7.0',
      costPerAcre: 3000,
      growthDays: 180,
      yield: '8-10 quintals/acre',
      status: 'Industrial'
    },
    {
      name: 'Soybean',
      emoji: '🫘',
      category: 'Oilseed',
      waterNeed: 'Medium',
      sunlight: 'Full Sun',
      soilPh: '6.0-7.0',
      costPerAcre: 1900,
      growthDays: 100,
      yield: '2-3 tons/acre',
      status: 'Recommended'
    }
  ];

  useEffect(() => {
    setPlantsData(mockPlantsData);
  }, []);

  const showPlant = async (plantName) => {
    setSelectedPlant(plantName);
    const info = await getPlantInfo(plantName);
    setPlantInfo(info);
  };

  const plantColumns = [
    {
      key: 'name',
      label: 'Plant',
      width: 2,
      render: (value, item) => (
        <View className="flex-row items-center">
          <Text className="text-lg mr-2">{item.emoji}</Text>
          <Text className="font-semibold text-gray-800">{value}</Text>
        </View>
      )
    },
    { key: 'category', label: 'Category', width: 1.5 },
    { key: 'waterNeed', label: 'Water', width: 1.2 },
    { key: 'sunlight', label: 'Sunlight', width: 1.5 },
    { key: 'soilPh', label: 'Soil pH', width: 1.2 },
    {
      key: 'costPerAcre',
      label: 'Cost ($/acre)',
      width: 1.5,
      render: (value) => (
        <Text className="font-semibold text-green-600">${value}</Text>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 1.5,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Recommended' ? 'bg-green-100' :
          value === 'Popular' ? 'bg-blue-100' :
          value === 'High Yield' ? 'bg-purple-100' :
          value === 'High Profit' ? 'bg-yellow-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Recommended' ? 'text-green-600' :
            value === 'Popular' ? 'text-blue-600' :
            value === 'High Yield' ? 'text-purple-600' :
            value === 'High Profit' ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            {value}
          </Text>
        </View>
      )
    },
  ];

  const stats = [
    { title: 'Total Crops', value: plantsData.length.toString(), icon: '🌱', color: 'from-green-500 to-emerald-600' },
    { title: 'Avg Cost/Acre', value: `$${Math.round(plantsData.reduce((sum, p) => sum + p.costPerAcre, 0) / plantsData.length)}`, icon: '💰', color: 'from-blue-500 to-cyan-600' },
    { title: 'High Yield Crops', value: plantsData.filter(p => p.status === 'High Yield').length.toString(), icon: '📈', color: 'from-purple-500 to-pink-600' },
    { title: 'Vegetables', value: plantsData.filter(p => p.category === 'Vegetable').length.toString(), icon: '🥕', color: 'from-orange-500 to-red-600' },
  ];

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">🌱 Plant Database</Text>
          <Text className="text-gray-600 text-lg">Comprehensive crop information and analytics</Text>
        </View>

        {/* Stats Cards */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-700 mb-4">Farm Overview</Text>
          <View className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </View>
        </View>

        {/* Plants Table */}
        <View className="mb-8">
          <DataTable
            title="Crop Database"
            data={plantsData}
            columns={plantColumns}
            searchable={true}
            sortable={true}
            maxHeight={400}
            emptyMessage="No plants found"
          />
        </View>

        {/* Plant Details */}
        {plantInfo && (
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center mb-6">
              <Text className="text-4xl mr-3">
                {mockPlantsData.find(p => p.name === plantInfo.name)?.emoji}
              </Text>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-800">{plantInfo.name}</Text>
                <Text className="text-gray-600">Detailed Growing Guide</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                mockPlantsData.find(p => p.name === plantInfo.name)?.status === 'Recommended' ? 'bg-green-100' :
                mockPlantsData.find(p => p.name === plantInfo.name)?.status === 'Popular' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Text className={`text-sm font-semibold ${
                  mockPlantsData.find(p => p.name === plantInfo.name)?.status === 'Recommended' ? 'text-green-600' :
                  mockPlantsData.find(p => p.name === plantInfo.name)?.status === 'Popular' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {mockPlantsData.find(p => p.name === plantInfo.name)?.status}
                </Text>
              </View>
            </View>

            <View className="grid grid-cols-2 gap-4 mb-6">
              <View className="bg-blue-50 p-4 rounded-xl">
                <Text className="text-2xl mb-2">💧</Text>
                <Text className="font-semibold text-gray-700">Water Needs</Text>
                <Text className="text-gray-600">{plantInfo.water_need}</Text>
              </View>

              <View className="bg-yellow-50 p-4 rounded-xl">
                <Text className="text-2xl mb-2">☀️</Text>
                <Text className="font-semibold text-gray-700">Sunlight</Text>
                <Text className="text-gray-600">{plantInfo.sunlight}</Text>
              </View>

              <View className="bg-green-50 p-4 rounded-xl">
                <Text className="text-2xl mb-2">🧪</Text>
                <Text className="font-semibold text-gray-700">Soil pH</Text>
                <Text className="text-gray-600">{plantInfo.soil_ph}</Text>
              </View>

              <View className="bg-purple-50 p-4 rounded-xl">
                <Text className="text-2xl mb-2">💰</Text>
                <Text className="font-semibold text-gray-700">Cost per Acre</Text>
                <Text className="text-lg font-bold text-green-600">${plantInfo.cost_per_acre}</Text>
              </View>
            </View>

            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="font-semibold text-gray-700 mb-2">Additional Information</Text>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Growth Period:</Text>
                <Text className="font-semibold">{mockPlantsData.find(p => p.name === plantInfo.name)?.growthDays} days</Text>
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-gray-600">Expected Yield:</Text>
                <Text className="font-semibold">{mockPlantsData.find(p => p.name === plantInfo.name)?.yield}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}