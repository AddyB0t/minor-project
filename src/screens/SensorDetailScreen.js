// Detailed sensor information screen
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DataTable from '../components/DataTable';
import MetricChart from '../components/MetricChart';
import StatCard from '../components/StatCard';

export default function SensorDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Get sensor data from route params
  const { sensorType, currentValue, icon, color } = route.params || {
    sensorType: 'Temperature',
    currentValue: '24°C',
    icon: '🌡️',
    color: 'from-orange-400 to-red-500'
  };

  // Mock comprehensive sensor data
  const [sensorData] = useState({
    current: currentValue,
    min: sensorType === 'Temperature' ? '20°C' : sensorType === 'Humidity' ? '60%' : sensorType === 'Soil Moisture' ? '70%' : '75%',
    max: sensorType === 'Temperature' ? '28°C' : sensorType === 'Humidity' ? '70%' : sensorType === 'Soil Moisture' ? '85%' : '90%',
    average: sensorType === 'Temperature' ? '24°C' : sensorType === 'Humidity' ? '65%' : sensorType === 'Soil Moisture' ? '78%' : '85%',
    status: 'Optimal',
    lastUpdated: new Date().toLocaleTimeString()
  });

  // Mock detailed historical data
  const [historicalData] = useState([
    { timestamp: '2024-01-20 00:00', value: sensorType === 'Temperature' ? '22°C' : sensorType === 'Humidity' ? '62%' : sensorType === 'Soil Moisture' ? '75%' : '82%', status: 'Normal' },
    { timestamp: '2024-01-20 04:00', value: sensorType === 'Temperature' ? '20°C' : sensorType === 'Humidity' ? '60%' : sensorType === 'Soil Moisture' ? '72%' : '80%', status: 'Low' },
    { timestamp: '2024-01-20 08:00', value: sensorType === 'Temperature' ? '24°C' : sensorType === 'Humidity' ? '65%' : sensorType === 'Soil Moisture' ? '78%' : '85%', status: 'Optimal' },
    { timestamp: '2024-01-20 12:00', value: sensorType === 'Temperature' ? '28°C' : sensorType === 'Humidity' ? '68%' : sensorType === 'Soil Moisture' ? '82%' : '88%', status: 'High' },
    { timestamp: '2024-01-20 16:00', value: sensorType === 'Temperature' ? '26°C' : sensorType === 'Humidity' ? '66%' : sensorType === 'Soil Moisture' ? '80%' : '86%', status: 'Optimal' },
    { timestamp: '2024-01-20 20:00', value: sensorType === 'Temperature' ? '24°C' : sensorType === 'Humidity' ? '64%' : sensorType === 'Soil Moisture' ? '77%' : '84%', status: 'Optimal' },
  ]);

  // Mock alerts and notifications
  const [alerts] = useState([
    { time: '08:30 AM', type: 'Info', message: `${sensorType} reading within optimal range`, severity: 'Low' },
    { time: '12:15 PM', type: 'Warning', message: `${sensorType} slightly above optimal range`, severity: 'Medium' },
    { time: '02:45 PM', type: 'Success', message: `${sensorType} returned to optimal range`, severity: 'Low' },
  ]);

  // Mock chart data (simplified for chart component)
  const chartData = historicalData.map(item => ({
    time: item.timestamp.split(' ')[1],
    value: item.value.replace(/[^\d.]/g, '')
  }));

  const getRecommendation = (sensorType) => {
    const recommendations = {
      'Temperature': 'Optimal range for most crops is 20-25°C. Current temperature is ideal for plant growth. Monitor during extreme weather conditions.',
      'Humidity': 'Good humidity levels maintained between 60-70%. This supports optimal plant transpiration and prevents fungal diseases.',
      'Soil Moisture': 'Excellent soil moisture levels. Current range supports healthy root development and nutrient uptake.',
      'Light Level': 'Great light exposure for photosynthesis. Plants are receiving adequate light for optimal growth and yield.'
    };
    return recommendations[sensorType] || 'Monitor this parameter regularly for optimal crop health.';
  };

  const getOptimalRange = (sensorType) => {
    const ranges = {
      'Temperature': '20-25°C',
      'Humidity': '60-70%',
      'Soil Moisture': '70-85%',
      'Light Level': '75-90%'
    };
    return ranges[sensorType] || 'N/A';
  };

  const historicalColumns = [
    {
      key: 'timestamp',
      label: 'Time',
      width: 2,
      render: (value) => (
        <Text className="text-sm text-gray-600">{value.split(' ')[1]}</Text>
      )
    },
    { key: 'value', label: 'Reading', width: 1.5 },
    {
      key: 'status',
      label: 'Status',
      width: 1.5,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Optimal' ? 'bg-green-100' :
          value === 'Normal' ? 'bg-blue-100' :
          value === 'High' ? 'bg-yellow-100' :
          value === 'Low' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Optimal' ? 'text-green-600' :
            value === 'Normal' ? 'text-blue-600' :
            value === 'High' ? 'text-yellow-600' :
            value === 'Low' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {value}
          </Text>
        </View>
      )
    },
  ];

  const alertsColumns = [
    { key: 'time', label: 'Time', width: 1.5 },
    {
      key: 'type',
      label: 'Type',
      width: 1.2,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Success' ? 'bg-green-100' :
          value === 'Warning' ? 'bg-yellow-100' :
          value === 'Info' ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Success' ? 'text-green-600' :
            value === 'Warning' ? 'text-yellow-600' :
            value === 'Info' ? 'text-blue-600' : 'text-gray-600'
          }`}>
            {value}
          </Text>
        </View>
      )
    },
    { key: 'message', label: 'Message', width: 4 },
  ];

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8 items-center">
          <View className={`w-24 h-24 rounded-full bg-gradient-to-r ${color} items-center justify-center mb-4 shadow-lg`}>
            <Text className="text-5xl">{icon}</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">{sensorType} Sensor</Text>
          <Text className="text-gray-600 text-lg">Detailed Analytics & History</Text>
        </View>

        {/* Current Status Cards */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-700 mb-4">Current Status</Text>
          <View className="grid grid-cols-2 gap-4 mb-4">
            <StatCard
              title="Current Reading"
              value={sensorData.current}
              icon={icon}
              color={color}
              subtitle={`Last updated: ${sensorData.lastUpdated}`}
            />
            <StatCard
              title="Optimal Range"
              value={getOptimalRange(sensorType)}
              icon="✅"
              color="from-green-500 to-emerald-600"
              subtitle="Target values"
            />
          </View>
          <View className="grid grid-cols-3 gap-4">
            <StatCard
              title="24h Average"
              value={sensorData.average}
              icon="📊"
              color="from-blue-500 to-cyan-600"
            />
            <StatCard
              title="24h Min"
              value={sensorData.min}
              icon="⬇️"
              color="from-red-500 to-pink-600"
            />
            <StatCard
              title="24h Max"
              value={sensorData.max}
              icon="⬆️"
              color="from-orange-500 to-red-600"
            />
          </View>
        </View>

        {/* Sensor Trend Chart */}
        <View className="mb-8">
          <MetricChart
            data={chartData}
            title={`${sensorType} Trend (24h)`}
            color="#F59E0B"
            unit={sensorType === 'Temperature' ? '°C' : '%'}
          />
        </View>

        {/* Historical Data Table */}
        <View className="mb-8">
          <DataTable
            title="Reading History"
            data={historicalData}
            columns={historicalColumns}
            maxHeight={300}
          />
        </View>

        {/* Alerts Table */}
        <View className="mb-8">
          <DataTable
            title="Recent Alerts"
            data={alerts}
            columns={alertsColumns}
            maxHeight={200}
          />
        </View>

        {/* AI Recommendations */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Text className="text-2xl mr-3">🤖</Text>
            <Text className="text-xl font-semibold text-gray-800">AI Analysis & Recommendations</Text>
          </View>
          <Text className="text-gray-600 leading-6 mb-4">{getRecommendation(sensorType)}</Text>

          <View className="bg-blue-50 p-4 rounded-xl">
            <Text className="font-semibold text-gray-700 mb-2">📋 Action Items:</Text>
            <Text className="text-gray-600 text-sm">• Monitor {sensorType.toLowerCase()} levels during peak sunlight hours</Text>
            <Text className="text-gray-600 text-sm">• Set up automated alerts for out-of-range values</Text>
            <Text className="text-gray-600 text-sm">• Review historical data weekly for trend analysis</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg"
            onPress={() => navigation.navigate('Chat', { initialMessage: `Tell me about ${sensorType} management for crops` })}
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