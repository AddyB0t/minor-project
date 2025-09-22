import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentColors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { platformShadow, Shadows } from '../../design-system/Shadows';

export default function IconButton({
  icon,
  onPress,
  size = 'medium',
  variant = 'ghost',
  color = 'neutral',
  disabled = false,
  badge = null,
  ripple = true,
  style = {},
  containerStyle = {},
  ...props
}) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
      case 'large':
        return {
          width: 56,
          height: 56,
          borderRadius: 28,
        };
      case 'xlarge':
        return {
          width: 64,
          height: 64,
          borderRadius: 32,
        };
      case 'medium':
      default:
        return {
          width: 44,
          height: 44,
          borderRadius: 22,
        };
    }
  };

  const getColorStyles = () => {
    const baseColors = {
      forest: EnvironmentColors.primary.forest,
      sky: EnvironmentColors.primary.sky,
      sunset: EnvironmentColors.accent.sunset,
      ocean: EnvironmentColors.primary.ocean,
      meadow: EnvironmentColors.accent.meadow,
      neutral: EnvironmentColors.neutral[600],
      white: EnvironmentColors.background.primary,
      danger: EnvironmentColors.semantic.error,
      success: EnvironmentColors.semantic.success,
      warning: EnvironmentColors.semantic.warning,
    };

    const selectedColor = baseColors[color] || baseColors.neutral;

    switch (variant) {
      case 'filled':
        return {
          backgroundColor: selectedColor,
          iconColor: EnvironmentColors.background.primary,
          shadow: Shadows.components.button,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: selectedColor,
          iconColor: selectedColor,
          shadow: Shadows.elevation[0],
        };
      case 'soft':
        return {
          backgroundColor: `${selectedColor}15`,
          iconColor: selectedColor,
          shadow: Shadows.elevation[0],
        };
      case 'gradient':
        const gradientColors = color === 'forest' 
          ? EnvironmentColors.gradients.forestGreen
          : color === 'sky'
          ? EnvironmentColors.gradients.skyBlue
          : color === 'sunset'
          ? EnvironmentColors.gradients.sunsetOrange
          : color === 'ocean'
          ? EnvironmentColors.gradients.oceanBlue
          : EnvironmentColors.gradients.forestGreen;
        return {
          gradient: gradientColors,
          iconColor: EnvironmentColors.background.primary,
          shadow: Shadows.components.button,
        };
      case 'ghost':
      default:
        return {
          backgroundColor: 'transparent',
          iconColor: selectedColor,
          shadow: Shadows.elevation[0],
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const colorStyles = getColorStyles();

  const buttonStyle = {
    ...sizeStyles,
    opacity: disabled ? 0.6 : 1,
    ...platformShadow(colorStyles.shadow),
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
  };

  const containerStyles = {
    position: 'relative',
    ...containerStyle,
  };

  const renderButton = () => {
    const content = (
      <View style={buttonStyle} className={variant === 'outlined' ? 'border-2' : ''}>
        {React.cloneElement(icon, {
          color: colorStyles.iconColor,
          size: size === 'small' ? 16 : size === 'large' ? 28 : size === 'xlarge' ? 32 : 20,
        })}
      </View>
    );

    if (variant === 'gradient' && colorStyles.gradient) {
      return (
        <LinearGradient
          colors={colorStyles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={buttonStyle}
        >
          {React.cloneElement(icon, {
            color: colorStyles.iconColor,
            size: size === 'small' ? 16 : size === 'large' ? 28 : size === 'xlarge' ? 32 : 20,
          })}
        </LinearGradient>
      );
    }

    return (
      <View style={[buttonStyle, { backgroundColor: colorStyles.backgroundColor, borderColor: colorStyles.borderColor }]}>
        {React.cloneElement(icon, {
          color: colorStyles.iconColor,
          size: size === 'small' ? 16 : size === 'large' ? 28 : size === 'xlarge' ? 32 : 20,
        })}
      </View>
    );
  };

  const renderBadge = () => {
    if (!badge) return null;

    const badgeSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;
    const badgeOffset = size === 'small' ? -2 : size === 'large' ? -4 : -3;

    return (
      <View
        style={{
          position: 'absolute',
          top: badgeOffset,
          right: badgeOffset,
          backgroundColor: EnvironmentColors.semantic.error,
          borderRadius: badgeSize / 2,
          minWidth: badgeSize,
          height: badgeSize,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 4,
          borderWidth: 2,
          borderColor: EnvironmentColors.background.primary,
        }}
      >
        <Text
          style={[
            Typography.styles.caption,
            {
              color: EnvironmentColors.background.primary,
              fontSize: size === 'small' ? 10 : 11,
              fontWeight: '600',
            },
          ]}
        >
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </Text>
      </View>
    );
  };

  return (
    <View style={containerStyles}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={ripple ? 0.7 : 1}
        {...props}
      >
        {renderButton()}
      </TouchableOpacity>
      {renderBadge()}
    </View>
  );
}