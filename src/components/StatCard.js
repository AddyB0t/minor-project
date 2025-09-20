import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function StatCard({
  title,
  value,
  icon,
  color = 'from-blue-500 to-purple-600',
  subtitle,
  onPress,
  trend,
  trendValue
}) {
  return (
    <TouchableOpacity
      className={`bg-white rounded-xl shadow-lg p-6 ${onPress ? 'active:bg-gray-50' : ''}`}
      onPress={onPress}
      disabled={!onPress}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} items-center justify-center`}>
          <Text className="text-2xl">{icon}</Text>
        </View>
        {trend && (
          <View className={`px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <Text className={`text-xs font-semibold ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
            </Text>
          </View>
        )}
      </View>

      <View className="mb-2">
        <Text className="text-gray-600 text-sm font-medium">{title}</Text>
      </View>

      <View className="flex-row items-baseline justify-between">
        <Text className="text-3xl font-bold text-gray-800">{value}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm">{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}