import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { theme } from './Theme';

export default function MindfulButton({
  children,
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left', // left, right
  style,
  ...props
}) {
  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? theme.colors.surfaceDark : theme.colors.primary,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: disabled ? 0 : 0.2,
          shadowRadius: 4,
          elevation: disabled ? 0 : 2,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? theme.colors.surfaceDark : theme.colors.secondary,
          shadowColor: theme.colors.secondary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: disabled ? 0 : 0.2,
          shadowRadius: 4,
          elevation: disabled ? 0 : 2,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? theme.colors.surfaceDark : theme.colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          minHeight: 44,
        };
    }
  };

  const getTextStyles = () => {
    const baseTextStyles = {
      fontWeight: theme.typography.medium,
    };

    switch (size) {
      case 'small':
        baseTextStyles.fontSize = theme.typography.caption;
        break;
      case 'large':
        baseTextStyles.fontSize = theme.typography.h5;
        break;
      default:
        baseTextStyles.fontSize = theme.typography.body;
        break;
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
        baseTextStyles.color = disabled ? theme.colors.textLight : theme.colors.textWhite;
        break;
      case 'outline':
        baseTextStyles.color = disabled ? theme.colors.surfaceDark : theme.colors.primary;
        break;
      case 'ghost':
        baseTextStyles.color = disabled ? theme.colors.textLight : theme.colors.primary;
        break;
      default:
        baseTextStyles.color = theme.colors.textPrimary;
        break;
    }

    return baseTextStyles;
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        getVariantStyles(),
        getSizeStyles(),
        style
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary' || variant === 'secondary'
              ? theme.colors.textWhite
              : theme.colors.primary
          }
        />
      ) : (
        <>
          {icon && (
            <Text style={[getTextStyles(), { marginHorizontal: theme.spacing.sm }]}>
              {icon}
            </Text>
          )}
          {title && (
            <Text style={getTextStyles()}>
              {title}
            </Text>
          )}
          {children}
        </>
      )}
    </TouchableOpacity>
  );
}

// Specialized button components for common use cases
export function PrimaryButton(props) {
  return <MindfulButton variant="primary" {...props} />;
}

export function SecondaryButton(props) {
  return <MindfulButton variant="secondary" {...props} />;
}

export function OutlineButton(props) {
  return <MindfulButton variant="outline" {...props} />;
}

export function FloatingActionButton({ onPress, icon = '+', style, ...props }) {
  return (
    <MindfulButton
      variant="primary"
      size="large"
      title=""
      icon={icon}
      onPress={onPress}
      style={[
        {
          position: 'absolute',
          bottom: theme.spacing.xl,
          right: theme.spacing.xl,
          width: 64,
          height: 64,
          borderRadius: 32,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        },
        style
      ]}
      {...props}
    />
  );
}