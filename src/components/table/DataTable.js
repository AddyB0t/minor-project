import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { EnvironmentColors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { ComponentSpacing } from '../../design-system/Spacing';
import { platformShadow, Shadows } from '../../design-system/Shadows';
import IconButton from '../buttons/IconButton';

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
  
  // Calculate column widths with minimum constraints
  const calculateColumnWidths = () => {
    const totalFlexUnits = columns.reduce((sum, col) => sum + (col.width || 1), 0);
    const availableWidth = horizontalScrollEnabled ? Math.max(screenWidth * 0.9, 400) : screenWidth * 0.9;
    
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
    switch (variant) {
      case 'elegant':
        return {
          container: { backgroundColor: EnvironmentColors.background.primary },
          header: { backgroundColor: EnvironmentColors.background.secondary },
          row: { backgroundColor: EnvironmentColors.background.primary },
          alternateRow: { backgroundColor: EnvironmentColors.neutral[50] },
        };
      case 'dark':
        return {
          container: { backgroundColor: EnvironmentColors.neutral[800] },
          header: { backgroundColor: EnvironmentColors.neutral[700] },
          row: { backgroundColor: EnvironmentColors.neutral[800] },
          alternateRow: { backgroundColor: EnvironmentColors.neutral[700] },
        };
      case 'green':
        return {
          container: { backgroundColor: EnvironmentColors.background.primary },
          header: { backgroundColor: EnvironmentColors.primary.forest + '10' },
          row: { backgroundColor: EnvironmentColors.background.primary },
          alternateRow: { backgroundColor: EnvironmentColors.primary.forest + '05' },
        };
      default:
        return {
          container: { backgroundColor: EnvironmentColors.background.primary },
          header: { backgroundColor: EnvironmentColors.background.secondary },
          row: { backgroundColor: EnvironmentColors.background.primary },
          alternateRow: { backgroundColor: EnvironmentColors.neutral[50] },
        };
    }
  };

  const variantStyles = getVariantStyles();

  const renderSearchBar = () => {
    if (!searchable) return null;

    return (
      <View className="px-4 py-3 border-b border-gray-100">
        <TextInput
          style={[
            Typography.styles.body,
            {
              backgroundColor: EnvironmentColors.background.secondary,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: EnvironmentColors.neutral[200],
            },
          ]}
          placeholder={searchPlaceholder}
          placeholderTextColor={EnvironmentColors.neutral[500]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={[variantStyles.header, { flexDirection: 'row', paddingVertical: 12, width: totalTableWidth }, headerStyle]}>
        {columns.map((column, index) => (
          <TouchableOpacity
            key={column.key}
            style={[
              {
                width: columnWidths[index],
                paddingHorizontal: ComponentSpacing.table.cellPadding,
                flexDirection: 'row',
                alignItems: 'center',
              },
              index === 0 && { paddingLeft: ComponentSpacing.table.outerPadding },
              index === columns.length - 1 && { paddingRight: ComponentSpacing.table.outerPadding },
            ]}
            onPress={() => handleSort(column)}
            disabled={!sortable || !column.sortable}
          >
            <Text
              style={[
                Typography.styles.tableHeader,
                { color: EnvironmentColors.neutral[700], flex: 1 },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {column.label}
            </Text>
            {sortable && column.sortable && (
              <View className="ml-1">
                {sortColumn?.key === column.key ? (
                  <Text style={{ color: EnvironmentColors.primary.forest, fontSize: 12 }}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </Text>
                ) : (
                  <Text style={{ color: EnvironmentColors.neutral[400], fontSize: 12 }}>
                    ↕
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
            paddingVertical: ComponentSpacing.table.rowPadding,
            borderBottomWidth: 1,
            borderBottomColor: EnvironmentColors.neutral[100],
            width: totalTableWidth,
          },
          rowStyle,
        ]}
        onPress={() => onRowPress?.(item)}
        disabled={!onRowPress}
      >
        {columns.map((column, columnIndex) => (
          <View
            key={column.key}
            style={[
              {
                width: columnWidths[columnIndex],
                paddingHorizontal: ComponentSpacing.table.cellPadding,
                justifyContent: 'center',
              },
              columnIndex === 0 && { paddingLeft: ComponentSpacing.table.outerPadding },
              columnIndex === columns.length - 1 && { paddingRight: ComponentSpacing.table.outerPadding },
            ]}
          >
            {column.render ? (
              column.render(item[column.key], item, index)
            ) : (
              <Text
                style={[
                  Typography.styles.tableCell,
                  { color: EnvironmentColors.neutral[800] },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
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
      <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-100">
        <Text style={[Typography.styles.caption, { color: EnvironmentColors.neutral[600] }]}>
          {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, sortedData.length)} of ${sortedData.length}`}
        </Text>
        
        <View className="flex-row items-center">
          <IconButton
            icon={<Text>‹</Text>}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            size="small"
            variant="ghost"
            color="neutral"
          />
          
          <Text style={[Typography.styles.caption, { marginHorizontal: 12, color: EnvironmentColors.neutral[700] }]}>
            {`${currentPage} / ${totalPages}`}
          </Text>
          
          <IconButton
            icon={<Text>›</Text>}
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            size="small"
            variant="ghost"
            color="neutral"
          />
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View className="items-center justify-center py-16">
        <Text style={[Typography.styles.body, { color: EnvironmentColors.neutral[500] }]}>
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
          ...platformShadow(Shadows.components.card),
        },
        style,
      ]}
      {...props}
    >
      {title && (
        <View className="px-4 py-3 border-b border-gray-100">
          <Text style={[Typography.styles.h3, { color: EnvironmentColors.neutral[800] }]}>
            {title}
          </Text>
        </View>
      )}
      
      {renderSearchBar()}
      
      <ScrollView
        horizontal={horizontalScrollEnabled}
        showsHorizontalScrollIndicator={horizontalScrollEnabled}
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