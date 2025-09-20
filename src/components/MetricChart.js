import React from 'react';
import { View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function MetricChart({ data, title, color = '#3B82F6', unit = '' }) {
  const maxValue = Math.max(...data.map(item => parseFloat(item.value)));
  const minValue = Math.min(...data.map(item => parseFloat(item.value)));

  return (
    <View className="bg-white rounded-xl shadow-lg p-6">
      <Text className="text-xl font-bold text-gray-800 mb-6">{title}</Text>

      <View className="flex-row justify-between mb-4">
        <Text className="text-sm text-gray-600">Min: {minValue}{unit}</Text>
        <Text className="text-sm text-gray-600">Max: {maxValue}{unit}</Text>
      </View>

      <View className="flex-row items-end justify-between h-32 mb-4">
        {data.map((item, index) => {
          const height = ((parseFloat(item.value) - minValue) / (maxValue - minValue)) * 100;
          return (
            <View key={index} className="items-center flex-1 mx-1">
              <View
                className="rounded-t-sm w-full"
                style={{
                  height: `${Math.max(height, 5)}%`,
                  backgroundColor: color,
                  minHeight: 5
                }}
              />
              <Text className="text-xs text-gray-600 mt-2 transform -rotate-45">
                {item.time}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="flex-row justify-center">
        <Text className="text-sm text-gray-500">Time</Text>
      </View>
    </View>
  );
}