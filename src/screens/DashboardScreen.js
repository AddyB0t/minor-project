// Dashboard screen for smart agriculture app
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatCard from '../components/cards/StatCard';
import DataTable from '../components/table/DataTable';

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

  // Waiting for sensor data
  const sensorData = [
    { sensor: 'Temperature', current: 'Waiting...', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
    { sensor: 'Humidity', current: 'Waiting...', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
    { sensor: 'Soil Moisture', current: 'Waiting...', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
    { sensor: 'Light Level', current: 'Waiting...', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
  ];

  // Waiting for recent activities
  const recentActivities = [
    { time: '--', activity: 'Waiting for sensor activities...', type: 'System', status: 'Standby' },
    { time: '--', activity: 'No recent irrigation data', type: 'Irrigation', status: 'Waiting' },
    { time: '--', activity: 'No monitoring activities', type: 'Monitoring', status: 'Waiting' },
    { time: '--', activity: 'No maintenance activities', type: 'Maintenance', status: 'Waiting' },
  ];


  const sensorColumns = [
    { key: 'sensor', label: 'Sensor', width: 2, minWidth: 120 },
    { key: 'current', label: 'Current', width: 1, minWidth: 80 },
    { key: 'min', label: 'Min', width: 1, minWidth: 70 },
    { key: 'max', label: 'Max', width: 1, minWidth: 70 },
    {
      key: 'status',
      label: 'Status',
      width: 1.5,
      minWidth: 100,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Optimal' ? 'bg-green-100' :
          value === 'Good' ? 'bg-blue-100' :
          value === 'Excellent' ? 'bg-purple-100' :
          value === 'No Signal' ? 'bg-red-100' :
          value === 'Waiting' ? 'bg-yellow-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Optimal' ? 'text-green-600' :
            value === 'Good' ? 'text-blue-600' :
            value === 'Excellent' ? 'text-purple-600' :
            value === 'No Signal' ? 'text-red-600' :
            value === 'Waiting' ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            {value}
          </Text>
        </View>
      )
    },
  ];

  const activityColumns = [
    { key: 'time', label: 'Time', width: 1.5, minWidth: 90 },
    { key: 'activity', label: 'Activity', width: 3, minWidth: 150 },
    { key: 'type', label: 'Type', width: 2, minWidth: 100 },
    {
      key: 'status',
      label: 'Status',
      width: 1.5,
      minWidth: 100,
      render: (value) => (
        <View className={`px-2 py-1 rounded-full ${
          value === 'Success' ? 'bg-green-100' :
          value === 'Normal' ? 'bg-blue-100' :
          value === 'Completed' ? 'bg-purple-100' :
          value === 'Standby' ? 'bg-yellow-100' :
          value === 'Waiting' ? 'bg-orange-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            value === 'Success' ? 'text-green-600' :
            value === 'Normal' ? 'text-blue-600' :
            value === 'Completed' ? 'text-purple-600' :
            value === 'Standby' ? 'text-yellow-600' :
            value === 'Waiting' ? 'text-orange-600' : 'text-gray-600'
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
    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Animated.View
        style={{
          padding: 24,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#1E293B', marginBottom: 8 }}>
            🌾 Smart Farm Dashboard
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B' }}>
            Monitor your crops in real-time
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#374151', marginBottom: 16 }}>
            Current Conditions
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {sensorData.map((sensor, index) => (
              <View key={index} style={{ width: '48%' }}>
                <StatCard
                  title={sensor.sensor}
                  value={sensor.current}
                  icon={sensor.sensor === 'Temperature' ? '🌡️' :
                        sensor.sensor === 'Humidity' ? '💧' :
                        sensor.sensor === 'Soil Moisture' ? '🌱' : '☀️'}
                  color={sensor.sensor === 'Temperature' ? 'sunset' :
                         sensor.sensor === 'Humidity' ? 'sky' :
                         sensor.sensor === 'Soil Moisture' ? 'forest' : 'sunset'}
                  subtitle={`${sensor.min} - ${sensor.max}`}
                  variant="solid"
                  size="medium"
                  onPress={() => navigateToSensor(sensor)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Sensor Data Table */}
        <View style={{ marginBottom: 32 }}>
          <DataTable
            title="Sensor Overview"
            data={sensorData}
            columns={sensorColumns}
            searchable={false}
            sortable={false}
            maxHeight={250}
          />
        </View>


        {/* Recent Activities Table */}
        <View style={{ marginBottom: 32 }}>
          <DataTable
            title="Recent Activities"
            data={recentActivities}
            columns={activityColumns}
            searchable={false}
            sortable={false}
            maxHeight={200}
          />
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#374151', marginBottom: 16 }}>Quick Actions</Text>
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#22C55E',
                padding: 16,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4
              }}
              onPress={navigateToChat}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, marginRight: 12 }}>🤖</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Chat with AgroAssist AI</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Get farming advice</Text>
                </View>
                <Text style={{ color: 'white', fontSize: 20 }}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#3B82F6',
                padding: 16,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4
              }}
              onPress={navigateToPlants}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, marginRight: 12 }}>🌱</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Plant Database</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Learn about crops</Text>
                </View>
                <Text style={{ color: 'white', fontSize: 20 }}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}