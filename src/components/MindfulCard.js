import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { theme } from './Theme';

export default function MindfulCard({
  children,
  title,
  subtitle,
  icon,
  onPress,
  variant = 'default', // default, elevated, outlined, filled
  size = 'medium', // small, medium, large
  color = 'primary',
  style,
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.textPrimary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.surfaceDark,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors[color] || theme.colors.primaryLight,
        };
      default:
        return {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.textPrimary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
        };
      case 'large':
        return {
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.xl,
        };
      default:
        return {
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
        };
    }
  };

  const CardContent = () => (
    <View style={[{ flex: 1 }, style]} {...props}>
      {(title || icon) && (
        <View className="flex-row items-center mb-3">
          {icon && (
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{
                backgroundColor: theme.colors[color] || theme.colors.primaryLight
              }}
            >
              <Text className="text-lg">{icon}</Text>
            </View>
          )}
          <View className="flex-1">
            {title && (
              <Text
                className="font-semibold text-lg"
                style={{ color: theme.colors.textPrimary }}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                className="text-sm mt-1"
                style={{ color: theme.colors.textSecondary }}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      )}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          getVariantStyles(),
          getSizeStyles(),
          {
            marginBottom: theme.spacing.md,
          }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        getVariantStyles(),
        getSizeStyles(),
        {
          marginBottom: theme.spacing.md,
        },
        style
      ]}
      {...props}
    >
      <CardContent />
    </View>
  );
}

// Specialized card components
export function BreathingCard({ children, ...props }) {
  return (
    <MindfulCard
      variant="elevated"
      color="primary"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, ${theme.colors.background} 100%)`,
      }}
      {...props}
    >
      {children}
    </MindfulCard>
  );
}

export function InsightCard({ children, ...props }) {
  return (
    <MindfulCard
      variant="outlined"
      color="secondary"
      {...props}
    >
      {children}
    </MindfulCard>
  );
}

export function ActionCard({ children, ...props }) {
  return (
    <MindfulCard
      variant="filled"
      color="primary"
      {...props}
    >
      {children}
    </MindfulCard>
  );
}