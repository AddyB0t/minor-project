import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function DataTable({
  data,
  columns,
  title,
  searchable = false,
  sortable = true,
  maxHeight = 300,
  emptyMessage = "No data available"
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <View className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <Text className="text-white text-xl font-bold">{title}</Text>
        {searchable && (
          <View className="mt-3">
            <TextInput
              className="bg-white/20 rounded-lg px-3 py-2 text-white placeholder-white/70"
              placeholder="Search..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        )}
      </View>

      {/* Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ maxHeight }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Table Header */}
            <View className="flex-row bg-gray-50 border-b border-gray-200">
              {columns.map((column, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-3 min-w-[100px] ${sortable ? 'active:bg-gray-100' : ''}`}
                  onPress={() => handleSort(column.key)}
                  disabled={!sortable}
                >
                  <View className="flex-row items-center">
                    <Text className="font-semibold text-gray-700 text-sm flex-1">
                      {column.label}
                    </Text>
                    {sortable && (
                      <Text className="text-gray-500 ml-1">
                        {getSortIcon(column.key)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Table Body */}
            {sortedData.length === 0 ? (
              <View className="p-8 items-center">
                <Text className="text-gray-500 text-center">{emptyMessage}</Text>
              </View>
            ) : (
              sortedData.map((item, rowIndex) => (
                <View
                  key={rowIndex}
                  className={`flex-row border-b border-gray-100 ${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <View
                      key={colIndex}
                      className="p-3 min-w-[100px] justify-center"
                      style={{ flex: column.width || 1 }}
                    >
                      {column.render ? (
                        column.render(item[column.key], item)
                      ) : (
                        <Text className="text-gray-800 text-sm">
                          {item[column.key]}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="bg-gray-50 p-3 border-t border-gray-200">
        <Text className="text-gray-600 text-sm text-center">
          Showing {sortedData.length} of {data.length} entries
        </Text>
      </View>
    </View>
  );
}