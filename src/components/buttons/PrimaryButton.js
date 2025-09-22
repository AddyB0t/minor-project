import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentColors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { ComponentSpacing } from '../../design-system/Spacing';
import { platformShadow, Shadows } from '../../design-system/Shadows';

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  size = 'medium',
  variant = 'forest',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  style = {},
  textStyle = {},
  ...props
}) {
  const getVariantColors = () => {
    switch (variant) {
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
      default:
        return EnvironmentColors.gradients.forestGreen;
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
        };
      case 'large':
        return {
          paddingHorizontal: ComponentSpacing.button.large.horizontal,
          paddingVertical: ComponentSpacing.button.large.vertical,
          minHeight: 56,
          borderRadius: 28,
        };
      case 'medium':
      default:
        return {
          paddingHorizontal: ComponentSpacing.button.medium.horizontal,
          paddingVertical: ComponentSpacing.button.medium.vertical,
          minHeight: 48,
          borderRadius: 24,
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
  const gradientColors = getVariantColors();
  const textStyles = getTextSize();

  const buttonStyle = {
    ...sizeStyles,
    ...(fullWidth && { width: '100%' }),
    opacity: disabled ? 0.6 : 1,
    ...platformShadow(disabled ? Shadows.elevation[0] : Shadows.components.button),
    ...style,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-row items-center justify-center">
          <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          <Text style={[textStyles, { color: 'white' }, textStyle]}>
            {typeof loading === 'string' ? loading : 'Loading...'}
          </Text>
        </View>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <View className="flex-row items-center justify-center">
          <View className="mr-2">{icon}</View>
          <Text style={[textStyles, { color: 'white' }, textStyle]}>{title}</Text>
        </View>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <View className="flex-row items-center justify-center">
          <Text style={[textStyles, { color: 'white' }, textStyle]}>{title}</Text>
          <View className="ml-2">{icon}</View>
        </View>
      );
    }

    return (
      <Text style={[textStyles, { color: 'white' }, textStyle]}>{title}</Text>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={buttonStyle}
      >
        <View className="flex-row items-center justify-center">
          {renderContent()}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}