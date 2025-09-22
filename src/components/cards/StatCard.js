import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentColors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { ComponentSpacing } from '../../design-system/Spacing';
import { platformShadow, Shadows } from '../../design-system/Shadows';

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  variant = 'gradient',
  color = 'forest',
  size = 'medium',
  onPress,
  style = {},
  ...props
}) {
  const getGradientColors = () => {
    switch (color) {
      case 'forest':
        return EnvironmentColors.gradients.forestGreen;
      case 'sky':
        return EnvironmentColors.gradients.skyBlue;
      case 'sunset':
        return EnvironmentColors.gradients.sunsetOrange;
      case 'ocean':
        return EnvironmentColors.gradients.oceanBlue;
      case 'meadow':
        return EnvironmentColors.gradients.meadowGreen;
      case 'instagram':
        return EnvironmentColors.gradients.instagram;
      case 'purple':
        return ['#8B5CF6', '#A855F7'];
      case 'pink':
        return ['#EC4899', '#F472B6'];
      default:
        return EnvironmentColors.gradients.forestGreen;
    }
  };

  const getSolidColors = () => {
    switch (color) {
      case 'forest':
        return {
          bg: EnvironmentColors.primary[500] + '10',
          accent: EnvironmentColors.primary[500],
        };
      case 'sky':
        return {
          bg: EnvironmentColors.secondary[500] + '10',
          accent: EnvironmentColors.secondary[500],
        };
      case 'sunset':
        return {
          bg: EnvironmentColors.environment.sunset + '10',
          accent: EnvironmentColors.environment.sunset,
        };
      case 'ocean':
        return {
          bg: EnvironmentColors.environment.water + '10',
          accent: EnvironmentColors.environment.water,
        };
      default:
        return {
          bg: EnvironmentColors.primary[500] + '10',
          accent: EnvironmentColors.primary[500],
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: ComponentSpacing.card.small,
          minHeight: 80,
          borderRadius: 12,
        };
      case 'large':
        return {
          padding: ComponentSpacing.card.large,
          minHeight: 140,
          borderRadius: 20,
        };
      case 'medium':
      default:
        return {
          padding: ComponentSpacing.card.medium,
          minHeight: 100,
          borderRadius: 16,
        };
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return EnvironmentColors.success;
      case 'negative':
        return EnvironmentColors.error;
      default:
        return EnvironmentColors.neutral[600];
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      default:
        return '→';
    }
  };

  const sizeStyles = getSizeStyles();
  const gradientColors = getGradientColors();
  const solidColors = getSolidColors();

  const cardStyle = {
    ...sizeStyles,
    ...platformShadow(Shadows.components.card),
    ...style,
  };

  const renderContent = () => {
    const textColor = variant === 'gradient' ? EnvironmentColors.background.primary : EnvironmentColors.neutral[800];
    const subtitleColor = variant === 'gradient' ? EnvironmentColors.background.primary + 'CC' : EnvironmentColors.neutral[600];
    const accentColor = variant === 'gradient' ? EnvironmentColors.background.primary : solidColors.accent;

    return (
      <View className="flex-1">
        {/* Header with icon and title */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <Text
              style={[
                size === 'small' ? Typography.styles.caption : Typography.styles.body,
                { color: subtitleColor, fontWeight: '500' },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          {icon && (
            <View className="ml-2">
              {typeof icon === 'string' ? (
                <Text style={{ fontSize: size === 'small' ? 20 : size === 'large' ? 28 : 24 }}>
                  {icon}
                </Text>
              ) : (
                React.cloneElement(icon, {
                  color: accentColor,
                  size: size === 'small' ? 20 : size === 'large' ? 28 : 24,
                })
              )}
            </View>
          )}
        </View>

        {/* Main value */}
        <View className="flex-1 justify-center">
          <Text
            style={[
              size === 'small' ? Typography.styles.h4 : size === 'large' ? Typography.styles.h1 : Typography.styles.h2,
              { color: textColor, fontWeight: '700' },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {value}
          </Text>
        </View>

        {/* Footer with subtitle and change */}
        <View className="flex-row items-center justify-between mt-2">
          {subtitle && (
            <Text
              style={[
                Typography.styles.caption,
                { color: subtitleColor, flex: 1 },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
          {change && (
            <View className="flex-row items-center ml-2">
              <Text style={{ color: getChangeColor(), fontSize: 12, marginRight: 2 }}>
                {getChangeIcon()}
              </Text>
              <Text
                style={[
                  Typography.styles.caption,
                  { color: getChangeColor(), fontWeight: '600' },
                ]}
              >
                {change}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  if (variant === 'gradient') {
    return (
      <CardWrapper onPress={onPress} activeOpacity={onPress ? 0.8 : 1} {...props}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cardStyle}
        >
          {renderContent()}
        </LinearGradient>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      style={[
        cardStyle,
        {
          backgroundColor: variant === 'solid' ? solidColors.accent : (variant === 'soft' ? solidColors.bg : EnvironmentColors.background.primary),
        },
      ]}
      {...props}
    >
      {renderContent()}
    </CardWrapper>
  );
}

// Specialized stat cards for common use cases
export function MetricCard({ metric, unit, ...props }) {
  return (
    <StatCard
      title={metric}
      value={`${props.value}${unit ? ` ${unit}` : ''}`}
      {...props}
    />
  );
}

export function PercentageCard({ percentage, ...props }) {
  const changeType = percentage > 0 ? 'positive' : percentage < 0 ? 'negative' : 'neutral';
  return (
    <StatCard
      value={`${percentage}%`}
      change={`${Math.abs(percentage)}%`}
      changeType={changeType}
      {...props}
    />
  );
}

export function CountCard({ count, ...props }) {
  return (
    <StatCard
      value={count.toLocaleString()}
      {...props}
    />
  );
}

// Grid layout for multiple stat cards
export function StatCardGrid({ cards = [], columns = 2, spacing = 12, style = {} }) {
  const renderRow = (rowCards, rowIndex) => (
    <View
      key={rowIndex}
      style={{
        flexDirection: 'row',
        marginBottom: spacing,
        gap: spacing,
      }}
    >
      {rowCards.map((card, index) => (
        <View key={index} style={{ flex: 1 }}>
          <StatCard {...card} />
        </View>
      ))}
      {/* Fill empty spaces */}
      {rowCards.length < columns &&
        Array(columns - rowCards.length)
          .fill(null)
          .map((_, index) => <View key={`empty-${index}`} style={{ flex: 1 }} />)}
    </View>
  );

  const rows = [];
  for (let i = 0; i < cards.length; i += columns) {
    rows.push(cards.slice(i, i + columns));
  }

  return (
    <View style={style}>
      {rows.map(renderRow)}
    </View>
  );
}