// Dashboard screen for smart agriculture app
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatCard from '../components/cards/StatCard';
import DataTable from '../components/table/DataTable';
import supabase from '../supabase';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sensor data state
  const [sensorData, setSensorData] = useState([
    { sensor: 'Temperature', current: 'Loading...', min: '--', max: '--', status: 'Loading', trend: 'waiting' },
    { sensor: 'Humidity', current: 'Loading...', min: '--', max: '--', status: 'Loading', trend: 'waiting' },
    { sensor: 'Soil Moisture', current: 'Loading...', min: '--', max: '--', status: 'Loading', trend: 'waiting' },
    { sensor: 'Light Level', current: 'Loading...', min: '--', max: '--', status: 'Loading', trend: 'waiting' },
  ]);

  // Recent activities state
  const [recentActivities, setRecentActivities] = useState([
    { time: '--', activity: 'Loading sensor data...', type: 'System', status: 'Standby' },
  ]);

  // Fetch sensor data from Supabase
  const fetchSensorData = async () => {
    try {
      // Get latest readings for each sensor type
      const sensorTypes = ['temperature', 'humidity', 'soil_moisture', 'light_level'];
      const newSensorData = [];
      const activities = [];

      for (const sensorType of sensorTypes) {
        // Get latest 10 readings for this sensor
        const { data, error } = await supabase
          .from('sensors')
          .select('*')
          .eq('sensor_type', sensorType)
          .order('reading_date', { ascending: false })
          .limit(10);

        if (error) {
          console.error(`Error fetching ${sensorType}:`, error);
          continue;
        }

        if (data && data.length > 0) {
          const values = data.map(d => parseFloat(d.value));
          const current = values[0];
          const min = Math.min(...values);
          const max = Math.max(...values);

          // Determine status based on sensor type and value
          let status = 'Good';
          let displayName = sensorType.charAt(0).toUpperCase() + sensorType.slice(1).replace('_', ' ');
          let unit = '';

          if (sensorType === 'temperature') {
            displayName = 'Temperature';
            unit = '°C';
            if (current >= 20 && current <= 30) status = 'Optimal';
            else if (current < 15 || current > 35) status = 'Warning';
          } else if (sensorType === 'humidity') {
            displayName = 'Humidity';
            unit = '%';
            if (current >= 60 && current <= 80) status = 'Optimal';
            else if (current < 40 || current > 90) status = 'Warning';
          } else if (sensorType === 'soil_moisture') {
            displayName = 'Soil Moisture';
            unit = '%';
            if (current >= 60 && current <= 80) status = 'Optimal';
            else if (current < 30) status = 'Warning';
          } else if (sensorType === 'light_level') {
            displayName = 'Light Level';
            unit = ' lux';
            if (current >= 10000 && current <= 50000) status = 'Excellent';
            else if (current >= 1000) status = 'Good';
          }

          newSensorData.push({
            sensor: displayName,
            current: `${current.toFixed(1)}${unit}`,
            min: `${min.toFixed(1)}${unit}`,
            max: `${max.toFixed(1)}${unit}`,
            status: status,
            trend: values.length > 1 && values[0] > values[1] ? 'up' : 'down'
          });

          // Add to activities
          const readingTime = new Date(data[0].reading_date);
          activities.push({
            time: readingTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            activity: `${displayName} reading: ${current.toFixed(1)}${unit}`,
            type: 'Sensor',
            status: status === 'Warning' ? 'Warning' : 'Success'
          });
        } else {
          // No data for this sensor
          let displayName = sensorType.charAt(0).toUpperCase() + sensorType.slice(1).replace('_', ' ');
          newSensorData.push({
            sensor: displayName,
            current: 'No Data',
            min: '--',
            max: '--',
            status: 'No Signal',
            trend: 'waiting'
          });
        }
      }

      if (newSensorData.length > 0) {
        setSensorData(newSensorData);
      }

      if (activities.length > 0) {
        setRecentActivities(activities.slice(0, 4));
      } else {
        setRecentActivities([
          { time: '--', activity: 'No sensor data yet. Connect Arduino!', type: 'System', status: 'Waiting' }
        ]);
      }

    } catch (error) {
      console.error('Error fetching sensor data:', error);
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
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Initial fetch
    fetchSensorData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('sensors-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensors' }, (payload) => {
        console.log('New sensor data:', payload);
        fetchSensorData(); // Refresh data on new insert
      })
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchSensorData, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);


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
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22C55E']} />
      }
    >
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