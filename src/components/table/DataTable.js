import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

// Shadcn dark theme colors
const darkColors = {
  background: '#09090B',
  card: '#18181B',
  cardHover: '#27272A',
  border: '#27272A',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  textDim: '#71717A',
};

export default function DataTable({
  title,
  data = [],
  columns = [],
  searchable = true,
  sortable = true,
  pagination = true,
  itemsPerPage = 10,
  maxHeight = 400,
  emptyMessage = 'No data available',
  onRowPress = null,
  style = {},
  headerStyle = {},
  rowStyle = {},
  searchPlaceholder = 'Search...',
  variant = 'default',
  columnMinWidth = 80,
  horizontalScrollEnabled = true,
  ...props
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const { width: screenWidth } = Dimensions.get('window');
  const isDark = variant === 'dark';

  // Calculate column widths with minimum constraints
  const calculateColumnWidths = () => {
    const totalFlexUnits = columns.reduce((sum, col) => sum + (col.width || 1), 0);
    const availableWidth = horizontalScrollEnabled ? Math.max(screenWidth - 40, 350) : screenWidth - 40;

    return columns.map(column => {
      const flexWidth = (availableWidth / totalFlexUnits) * (column.width || 1);
      const minWidth = column.minWidth || columnMinWidth;
      return Math.max(flexWidth, minWidth);
    });
  };

  const columnWidths = calculateColumnWidths();
  const totalTableWidth = columnWidths.reduce((sum, width) => sum + width, 0);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter(item =>
      columns.some(column => {
        const value = item[column.key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchQuery);
        }
        return false;
      })
    );
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn.key];
      const bValue = b[sortColumn.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (column) => {
    if (!sortable || !column.sortable) return;

    if (sortColumn?.key === column.key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getVariantStyles = () => {
    if (isDark) {
      return {
        container: { backgroundColor: darkColors.card },
        header: { backgroundColor: darkColors.cardHover },
        row: { backgroundColor: darkColors.card },
        alternateRow: { backgroundColor: 'rgba(39, 39, 42, 0.5)' },
        text: { color: darkColors.text },
        textMuted: { color: darkColors.textMuted },
        border: { borderColor: darkColors.border },
      };
    }
    return {
      container: { backgroundColor: '#FFFFFF' },
      header: { backgroundColor: '#F9FAFB' },
      row: { backgroundColor: '#FFFFFF' },
      alternateRow: { backgroundColor: '#F9FAFB' },
      text: { color: '#1F2937' },
      textMuted: { color: '#6B7280' },
      border: { borderColor: '#E5E7EB' },
    };
  };

  const variantStyles = getVariantStyles();

  const renderSearchBar = () => {
    if (!searchable) return null;

    return (
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, ...variantStyles.border }}>
        <TextInput
          style={{
            backgroundColor: isDark ? darkColors.background : '#F3F4F6',
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 14,
            color: isDark ? darkColors.text : '#1F2937',
            borderWidth: 1,
            borderColor: isDark ? darkColors.border : '#E5E7EB',
          }}
          placeholder={searchPlaceholder}
          placeholderTextColor={isDark ? darkColors.textDim : '#9CA3AF'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={[
        variantStyles.header,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          width: totalTableWidth,
          borderBottomWidth: 1,
          ...variantStyles.border,
        },
        headerStyle
      ]}>
        {columns.map((column, index) => (
          <TouchableOpacity
            key={column.key}
            style={{
              width: columnWidths[index],
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              height: 24,
            }}
            onPress={() => handleSort(column)}
            disabled={!sortable || !column.sortable}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: isDark ? darkColors.textMuted : '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
              numberOfLines={1}
            >
              {column.label}
            </Text>
            {sortable && column.sortable && (
              <View style={{ marginLeft: 4 }}>
                {sortColumn?.key === column.key ? (
                  <Text style={{ color: isDark ? '#22C55E' : '#16A34A', fontSize: 10 }}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </Text>
                ) : (
                  <Text style={{ color: isDark ? darkColors.textDim : '#9CA3AF', fontSize: 10 }}>
                    ◆
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRow = (item, index) => {
    const isAlternate = index % 2 === 1;
    const rowBgStyle = isAlternate ? variantStyles.alternateRow : variantStyles.row;

    return (
      <TouchableOpacity
        key={item.id || index}
        style={[
          rowBgStyle,
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            borderBottomWidth: 1,
            width: totalTableWidth,
            minHeight: 52,
            ...variantStyles.border,
          },
          rowStyle,
        ]}
        onPress={() => onRowPress?.(item)}
        disabled={!onRowPress}
        activeOpacity={0.7}
      >
        {columns.map((column, columnIndex) => (
          <View
            key={column.key}
            style={{
              width: columnWidths[columnIndex],
              paddingHorizontal: 12,
              justifyContent: 'center',
              alignItems: column.render ? 'flex-start' : 'flex-start',
            }}
          >
            {column.render ? (
              column.render(item[column.key], item, index)
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? darkColors.text : '#1F2937',
                  lineHeight: 20,
                }}
                numberOfLines={2}
              >
                {item[column.key]}
              </Text>
            )}
          </View>
        ))}
      </TouchableOpacity>
    );
  };

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        ...variantStyles.border,
      }}>
        <Text style={{ fontSize: 13, color: isDark ? darkColors.textMuted : '#6B7280' }}>
          {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, sortedData.length)} of ${sortedData.length}`}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              backgroundColor: isDark ? darkColors.cardHover : '#F3F4F6',
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <Text style={{ fontSize: 14, color: isDark ? darkColors.text : '#1F2937' }}>←</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 13, color: isDark ? darkColors.text : '#1F2937', marginHorizontal: 8 }}>
            {`${currentPage} / ${totalPages}`}
          </Text>

          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              backgroundColor: isDark ? darkColors.cardHover : '#F3F4F6',
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <Text style={{ fontSize: 14, color: isDark ? darkColors.text : '#1F2937' }}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
        <Text style={{ fontSize: 14, color: isDark ? darkColors.textDim : '#9CA3AF' }}>
          {emptyMessage}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        variantStyles.container,
        {
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: 1,
          ...variantStyles.border,
        },
        style,
      ]}
      {...props}
    >
      {title && (
        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          ...variantStyles.border,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? darkColors.text : '#1F2937',
          }}>
            {title}
          </Text>
        </View>
      )}

      {renderSearchBar()}

      <ScrollView
        horizontal={horizontalScrollEnabled}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={{ maxHeight }}
      >
        <ScrollView
          style={{ width: horizontalScrollEnabled ? totalTableWidth : '100%' }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {renderHeader()}

          {paginatedData.length > 0 ? (
            paginatedData.map(renderRow)
          ) : (
            <View style={{ width: totalTableWidth }}>
              {renderEmptyState()}
            </View>
          )}
        </ScrollView>
      </ScrollView>

      {renderPagination()}
    </View>
  );
}
