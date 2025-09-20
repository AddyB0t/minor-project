// Dashboard screen for smart agriculture app
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import MetricChart from '../components/MetricChart';

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

  // Mock sensor data
  const sensorData = [
    { sensor: 'Temperature', current: '24°C', min: '20°C', max: '28°C', status: 'Optimal', trend: 'stable' },
    { sensor: 'Humidity', current: '65%', min: '60%', max: '70%', status: 'Good', trend: 'up' },
    { sensor: 'Soil Moisture', current: '78%', min: '70%', max: '85%', status: 'Excellent', trend: 'stable' },
    { sensor: 'Light Level', current: '85%', min: '75%', max: '90%', status: 'Optimal', trend: 'down' },
  ];

  // Mock recent activities
  const recentActivities = [
    { time: '10:30 AM', activity: 'Watering completed', type: 'Irrigation', status: 'Success' },
    { time: '09:15 AM', activity: 'Temperature check', type: 'Monitoring', status: 'Normal' },
    { time: '08:45 AM', activity: 'Soil pH measured', type: 'Analysis', status: 'Optimal' },
    { time: '08:00 AM', activity: 'Light sensor calibrated', type: 'Maintenance', status: 'Completed' },
  ];

  // Mock chart data
  const chartData = [
    { time: '00:00', value: '22' },
    { time: '04:00', value: '20' },
    { time: '08:00', value: '24' },
    { time: '12:00', value: '28' },
    { time: '16:00', value: '26' },
    { time: '20:00', value: '24' },
  ];

  const sensorColumns = [
    { key: 'sensor', label: 'Sensor', width: 2 },
    { key: 'current', label: 'Current', width: 1 },
    { key: 'min', label: 'Min', width: 1 },
    { key: 'max', label: 'Max', width: 1 },
    {
      key: 'status',
      label: 'Status',
      width: 1.5,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Optimal' ? 'bg-green-100' :
          value === 'Good' ? 'bg-blue-100' :
          value === 'Excellent' ? 'bg-purple-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Optimal' ? 'text-green-600' :
            value === 'Good' ? 'text-blue-600' :
            value === 'Excellent' ? 'text-purple-600' : 'text-gray-600'
          }`}>
            {value}
          </Text>
        </View>
      )
    },
  ];

  const activityColumns = [
    { key: 'time', label: 'Time', width: 1.5 },
    { key: 'activity', label: 'Activity', width: 3 },
    { key: 'type', label: 'Type', width: 2 },
    {
      key: 'status',
      label: 'Status',
      width: 1.5,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Success' ? 'bg-green-100' :
          value === 'Normal' ? 'bg-blue-100' :
          value === 'Completed' ? 'bg-purple-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Success' ? 'text-green-600' :
            value === 'Normal' ? 'text-blue-600' :
            value === 'Completed' ? 'text-purple-600' : 'text-gray-600'
          }`}>
            {value}
          </Text>
        </View>
      )
    },
  ];

  const navigateToChat = () => {
    navigation.navigate('Chat');
  };

  const navigateToPlants = () => {
    navigation.navigate('Plants');
  };

  const navigateToSensor = (sensor) => {
    navigation.navigate('SensorDetail', {
      sensorType: sensor.sensor,
      currentValue: sensor.current,
      icon: sensor.sensor === 'Temperature' ? '🌡️' :
            sensor.sensor === 'Humidity' ? '💧' :
            sensor.sensor === 'Soil Moisture' ? '🌱' : '☀️',
      color: sensor.sensor === 'Temperature' ? 'from-orange-400 to-red-500' :
             sensor.sensor === 'Humidity' ? 'from-blue-400 to-cyan-500' :
             sensor.sensor === 'Soil Moisture' ? 'from-green-400 to-emerald-500' :
             'from-yellow-400 to-orange-500'
    });
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
          <Text className="text-3xl font-bold text-gray-800 mb-2">🌾 Smart Farm Dashboard</Text>
          <Text className="text-gray-600 text-lg">Monitor your crops in real-time</Text>
        </View>

        {/* Stats Cards */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-700 mb-4">Current Conditions</Text>
          <View className="grid grid-cols-2 gap-4">
            {sensorData.map((sensor, index) => (
              <StatCard
                key={index}
                title={sensor.sensor}
                value={sensor.current}
                icon={sensor.sensor === 'Temperature' ? '🌡️' :
                      sensor.sensor === 'Humidity' ? '💧' :
                      sensor.sensor === 'Soil Moisture' ? '🌱' : '☀️'}
                color={sensor.sensor === 'Temperature' ? 'from-orange-400 to-red-500' :
                       sensor.sensor === 'Humidity' ? 'from-blue-400 to-cyan-500' :
                       sensor.sensor === 'Soil Moisture' ? 'from-green-400 to-emerald-500' :
                       'from-yellow-400 to-orange-500'}
                subtitle={`${sensor.min} - ${sensor.max}`}
                trend={sensor.trend === 'up' ? 'up' : sensor.trend === 'down' ? 'down' : null}
                trendValue={sensor.trend !== 'stable' ? '2%' : null}
                onPress={() => navigateToSensor(sensor)}
              />
            ))}
          </View>
        </View>

        {/* Sensor Data Table */}
        <View className="mb-8">
          <DataTable
            title="Sensor Overview"
            data={sensorData}
            columns={sensorColumns}
            searchable={true}
            maxHeight={250}
          />
        </View>

        {/* Temperature Chart */}
        <View className="mb-8">
          <MetricChart
            data={chartData}
            title="Temperature Trend (24h)"
            color="#F59E0B"
            unit="°C"
          />
        </View>

        {/* Recent Activities Table */}
        <View className="mb-8">
          <DataTable
            title="Recent Activities"
            data={recentActivities}
            columns={activityColumns}
            maxHeight={200}
          />
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