// Dashboard screen for smart agriculture app
// Fetches REAL sensor data from Arduino via local server
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import StatCard from '../components/cards/StatCard';
import DataTable from '../components/table/DataTable';

const { width } = Dimensions.get('window');

// Server URL - Arduino data comes through here
// CHANGE THIS to your laptop's IP address!
// Find it using: hostname -I (Linux) or ipconfig (Windows)
const SENSOR_SERVER = 'http://192.168.1.101:3001';  // Your laptop IP

// Shadcn dark theme colors
const colors = {
  background: '#09090B',
  card: '#18181B',
  cardHover: '#27272A',
  border: '#27272A',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  textDim: '#71717A',
  primary: '#22C55E',
  primaryMuted: '#16A34A',
  accent: '#3B82F6',
  warning: '#F59E0B',
  error: '#EF4444',
  success: '#22C55E',
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  // Sensor data state
  const [sensorData, setSensorData] = useState([
    { sensor: 'Temperature', current: 'Connecting...', min: '--', max: '--', status: 'Loading', trend: 'waiting' },
    { sensor: 'Humidity', current: 'Connecting...', min: '--', max: '--', status: 'Loading', trend: 'waiting' },
    { sensor: 'Soil Moisture', current: 'Connecting...', min: '--', max: '--', status: 'Loading', trend: 'waiting' },
    { sensor: 'Light Level', current: 'Connecting...', min: '--', max: '--', status: 'Loading', trend: 'waiting' },
  ]);

  // Recent activities state
  const [recentActivities, setRecentActivities] = useState([
    { time: '--', activity: 'Connecting to Arduino...', type: 'System', status: 'Standby' },
  ]);

  // Fetch sensor data from local Node.js server (which reads Arduino Serial)
  const fetchSensorData = async () => {
    try {
      const response = await fetch(`${SENSOR_SERVER}/sensors`);
      const data = await response.json();

      if (!data.connected) {
        setSensorData([
          { sensor: 'Temperature', current: 'No Arduino', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
          { sensor: 'Humidity', current: 'No Arduino', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
          { sensor: 'Soil Moisture', current: 'No Arduino', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
          { sensor: 'Light Level', current: 'No Arduino', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
        ]);
        setRecentActivities([
          { time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            activity: 'Arduino not connected. Check USB.', type: 'System', status: 'Warning' }
        ]);
        setConnected(false);
        return;
      }

      setConnected(true);
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Process temperature
      const temp = data.temperature;
      const tempStatus = temp >= 20 && temp <= 30 ? 'Optimal' : temp < 15 || temp > 35 ? 'Warning' : 'Good';

      // Process humidity
      const hum = data.humidity;
      const humStatus = hum >= 60 && hum <= 80 ? 'Optimal' : hum < 40 || hum > 90 ? 'Warning' : 'Good';

      // Process soil moisture
      const soil = data.soil_moisture;
      const soilStatus = soil >= 60 && soil <= 80 ? 'Optimal' : soil < 30 ? 'Warning' : 'Good';

      // Process light level
      const light = data.light_level;
      const lightStatus = light >= 10000 && light <= 50000 ? 'Excellent' : light >= 1000 ? 'Good' : 'Low';

      // Process pH
      const ph = data.ph_value;

      const newSensorData = [
        {
          sensor: 'Temperature',
          current: `${temp.toFixed(1)}°C`,
          min: `${data.history?.temperature?.min?.toFixed(1) || temp.toFixed(1)}°C`,
          max: `${data.history?.temperature?.max?.toFixed(1) || temp.toFixed(1)}°C`,
          status: tempStatus,
          trend: 'up'
        },
        {
          sensor: 'Humidity',
          current: `${hum.toFixed(1)}%`,
          min: `${data.history?.humidity?.min?.toFixed(1) || hum.toFixed(1)}%`,
          max: `${data.history?.humidity?.max?.toFixed(1) || hum.toFixed(1)}%`,
          status: humStatus,
          trend: 'up'
        },
        {
          sensor: 'Soil Moisture',
          current: `${soil.toFixed(1)}%`,
          min: `${data.history?.soil_moisture?.min?.toFixed(1) || soil.toFixed(1)}%`,
          max: `${data.history?.soil_moisture?.max?.toFixed(1) || soil.toFixed(1)}%`,
          status: soilStatus,
          trend: 'up'
        },
        {
          sensor: 'Light Level',
          current: `${light.toFixed(0)} lux`,
          min: `${data.history?.light_level?.min?.toFixed(0) || light.toFixed(0)} lux`,
          max: `${data.history?.light_level?.max?.toFixed(0) || light.toFixed(0)} lux`,
          status: lightStatus,
          trend: 'up'
        }
      ];

      setSensorData(newSensorData);

      // Update activities
      setRecentActivities([
        { time: now, activity: `Temperature: ${temp.toFixed(1)}°C`, type: 'Sensor', status: tempStatus === 'Warning' ? 'Warning' : 'Success' },
        { time: now, activity: `Humidity: ${hum.toFixed(1)}%`, type: 'Sensor', status: humStatus === 'Warning' ? 'Warning' : 'Success' },
        { time: now, activity: `Soil Moisture: ${soil.toFixed(1)}%`, type: 'Sensor', status: soilStatus === 'Warning' ? 'Warning' : 'Success' },
        { time: now, activity: `pH Level: ${ph.toFixed(2)}`, type: 'Sensor', status: 'Success' },
      ]);

    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setSensorData([
        { sensor: 'Temperature', current: 'Server Off', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
        { sensor: 'Humidity', current: 'Server Off', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
        { sensor: 'Soil Moisture', current: 'Server Off', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
        { sensor: 'Light Level', current: 'Server Off', min: '--', max: '--', status: 'No Signal', trend: 'waiting' },
      ]);
      setRecentActivities([
        { time: '--', activity: 'Start server: node server.js', type: 'System', status: 'Warning' }
      ]);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSensorData();
    setRefreshing(false);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Initial fetch
    fetchSensorData();

    // Fetch every 5 seconds (matches Arduino send interval)
    const interval = setInterval(fetchSensorData, 5000);

    return () => clearInterval(interval);
  }, []);


  const sensorColumns = [
    { key: 'sensor', label: 'Sensor', width: 2, minWidth: 100 },
    { key: 'current', label: 'Current', width: 1.2, minWidth: 80 },
    { key: 'min', label: 'Min', width: 1, minWidth: 70 },
    { key: 'max', label: 'Max', width: 1, minWidth: 70 },
    {
      key: 'status',
      label: 'Status',
      width: 1.2,
      minWidth: 90,
      render: (value) => (
        <View style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: value === 'Optimal' ? 'rgba(34, 197, 94, 0.15)' :
                          value === 'Good' ? 'rgba(59, 130, 246, 0.15)' :
                          value === 'Excellent' ? 'rgba(168, 85, 247, 0.15)' :
                          value === 'No Signal' ? 'rgba(239, 68, 68, 0.15)' :
                          value === 'Warning' ? 'rgba(245, 158, 11, 0.15)' :
                          value === 'Low' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(113, 113, 122, 0.15)'
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            textAlign: 'center',
            color: value === 'Optimal' ? '#4ADE80' :
                   value === 'Good' ? '#60A5FA' :
                   value === 'Excellent' ? '#C084FC' :
                   value === 'No Signal' ? '#F87171' :
                   value === 'Warning' ? '#FBBF24' :
                   value === 'Low' ? '#FBBF24' : '#A1A1AA'
          }}>
            {value}
          </Text>
        </View>
      )
    },
  ];

  const activityColumns = [
    { key: 'time', label: 'Time', width: 1, minWidth: 70 },
    { key: 'activity', label: 'Activity', width: 2.5, minWidth: 140 },
    { key: 'type', label: 'Type', width: 1, minWidth: 70 },
    {
      key: 'status',
      label: 'Status',
      width: 1.2,
      minWidth: 80,
      render: (value) => (
        <View style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: value === 'Success' ? 'rgba(34, 197, 94, 0.15)' :
                          value === 'Normal' ? 'rgba(59, 130, 246, 0.15)' :
                          value === 'Warning' ? 'rgba(245, 158, 11, 0.15)' :
                          value === 'Standby' ? 'rgba(113, 113, 122, 0.15)' : 'rgba(113, 113, 122, 0.15)'
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            textAlign: 'center',
            color: value === 'Success' ? '#4ADE80' :
                   value === 'Normal' ? '#60A5FA' :
                   value === 'Warning' ? '#FBBF24' :
                   value === 'Standby' ? '#A1A1AA' : '#A1A1AA'
          }}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        }
      >
        <Animated.View
          style={{
            padding: 20,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
              Smart Farm Dashboard
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: connected ? colors.success : colors.error,
                marginRight: 8
              }} />
              <Text style={{ fontSize: 14, color: colors.textMuted }}>
                {connected ? 'Arduino Connected - Live Data' : 'Arduino Disconnected'}
              </Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 14 }}>
              Current Conditions
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {sensorData.map((sensor, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: '48%',
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  onPress={() => navigateToSensor(sensor)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: 6 }}>
                    {sensor.sensor === 'Temperature' ? '🌡️' :
                     sensor.sensor === 'Humidity' ? '💧' :
                     sensor.sensor === 'Soil Moisture' ? '🌱' : '☀️'} {sensor.sensor}
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                    {sensor.current}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textDim }}>
                    {sensor.min} - {sensor.max}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sensor Data Table */}
          <View style={{ marginBottom: 24 }}>
            <DataTable
              title="Sensor Overview"
              data={sensorData}
              columns={sensorColumns}
              searchable={false}
              sortable={false}
              pagination={false}
              maxHeight={220}
              variant="dark"
            />
          </View>

          {/* Recent Activities Table */}
          <View style={{ marginBottom: 24 }}>
            <DataTable
              title="Recent Activities"
              data={recentActivities}
              columns={activityColumns}
              searchable={false}
              sortable={false}
              pagination={false}
              maxHeight={200}
              variant="dark"
            />
          </View>

          {/* Quick Actions */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 14 }}>
              Quick Actions
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  padding: 16,
                  borderRadius: 12,
                }}
                onPress={navigateToChat}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>🤖</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Chat with AgroAssist AI</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Get farming advice</Text>
                  </View>
                  <Text style={{ color: '#FFFFFF', fontSize: 18 }}>→</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.accent,
                  padding: 16,
                  borderRadius: 12,
                }}
                onPress={navigateToPlants}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>🌱</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Plant Database</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Learn about crops</Text>
                  </View>
                  <Text style={{ color: '#FFFFFF', fontSize: 18 }}>→</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
