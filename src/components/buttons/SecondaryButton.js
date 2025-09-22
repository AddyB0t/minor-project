import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { EnvironmentColors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { ComponentSpacing } from '../../design-system/Spacing';
import { platformShadow, Shadows } from '../../design-system/Shadows';

export default function SecondaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  size = 'medium',
  variant = 'forest',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  ghost = false,
  style = {},
  textStyle = {},
  ...props
}) {
  const getVariantColors = () => {
    switch (variant) {
      case 'forest':
        return {
          border: EnvironmentColors.primary.forest,
          text: EnvironmentColors.primary.forest,
          background: ghost ? 'transparent' : EnvironmentColors.background.primary,
        };
      case 'sky':
        return {
          border: EnvironmentColors.primary.sky,
          text: EnvironmentColors.primary.sky,
          background: ghost ? 'transparent' : EnvironmentColors.background.primary,
        };
      case 'sunset':
        return {
          border: EnvironmentColors.accent.sunset,
          text: EnvironmentColors.accent.sunset,
          background: ghost ? 'transparent' : EnvironmentColors.background.primary,
        };
      case 'ocean':
        return {
          border: EnvironmentColors.primary.ocean,
          text: EnvironmentColors.primary.ocean,
          background: ghost ? 'transparent' : EnvironmentColors.background.primary,
        };
      case 'meadow':
        return {
          border: EnvironmentColors.accent.meadow,
          text: EnvironmentColors.accent.meadow,
          background: ghost ? 'transparent' : EnvironmentColors.background.primary,
        };
      case 'neutral':
        return {
          border: EnvironmentColors.neutral[500],
          text: EnvironmentColors.neutral[700],
          background: ghost ? 'transparent' : EnvironmentColors.background.primary,
        };
      default:
        return {
          border: EnvironmentColors.primary.forest,
          text: EnvironmentColors.primary.forest,
          background: ghost ? 'transparent' : EnvironmentColors.background.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: ComponentSpacing.button.small.horizontal,
          paddingVertical: ComponentSpacing.button.small.vertical,
          minHeight: 36,
          borderRadius: 18,
          borderWidth: 1.5,
        };
      case 'large':
        return {
          paddingHorizontal: ComponentSpacing.button.large.horizontal,
          paddingVertical: ComponentSpacing.button.large.vertical,
          minHeight: 56,
          borderRadius: 28,
          borderWidth: 2,
        };
      case 'medium':
      default:
        return {
          paddingHorizontal: ComponentSpacing.button.medium.horizontal,
          paddingVertical: ComponentSpacing.button.medium.vertical,
          minHeight: 48,
          borderRadius: 24,
          borderWidth: 2,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return Typography.styles.buttonSmall;
      case 'large':
        return Typography.styles.buttonLarge;
      case 'medium':
      default:
        return Typography.styles.button;
    }
  };

  const sizeStyles = getSizeStyles();
  const colors = getVariantColors();
  const textStyles = getTextSize();

  const buttonStyle = {
    ...sizeStyles,
    backgroundColor: colors.background,
    borderColor: colors.border,
    ...(fullWidth && { width: '100%' }),
    opacity: disabled ? 0.6 : 1,
    ...(!ghost && platformShadow(disabled ? Shadows.elevation[0] : Shadows.elevation[1])),
    ...style,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-row items-center justify-center">
          <View 
            className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2"
            style={{ borderColor: colors.text }}
          />
          <Text style={[textStyles, { color: colors.text }, textStyle]}>
            {typeof loading === 'string' ? loading : 'Loading...'}
          </Text>
        </View>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <View className="flex-row items-center justify-center">
          <View className="mr-2">{icon}</View>
          <Text style={[textStyles, { color: colors.text }, textStyle]}>{title}</Text>
        </View>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <View className="flex-row items-center justify-center">
          <Text style={[textStyles, { color: colors.text }, textStyle]}>{title}</Text>
          <View className="ml-2">{icon}</View>
        </View>
      );
    }

    return (
      <Text style={[textStyles, { color: colors.text }, textStyle]}>{title}</Text>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={buttonStyle}
      {...props}
    >
      <View className="flex-row items-center justify-center">
        {renderContent()}
      </View>
    </TouchableOpacity>
  );
}