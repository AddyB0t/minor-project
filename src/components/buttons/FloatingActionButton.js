import React from 'react';
import { TouchableOpacity, View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentColors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { platformShadow, Shadows } from '../../design-system/Shadows';

export default function FloatingActionButton({
  icon,
  onPress,
  size = 'normal',
  variant = 'forest',
  position = 'bottom-right',
  extended = false,
  label = '',
  disabled = false,
  style = {},
  containerStyle = {},
  ...props
}) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
        };
      case 'large':
        return {
          width: 72,
          height: 72,
          borderRadius: 36,
        };
      case 'normal':
      default:
        return {
          width: 56,
          height: 56,
          borderRadius: 28,
        };
    }
  };

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
      case 'instagram':
        return EnvironmentColors.gradients.instagram;
      default:
        return EnvironmentColors.gradients.forestGreen;
    }
  };

  const getPositionStyles = () => {
    const offset = 20;
    switch (position) {
      case 'top-left':
        return { position: 'absolute', top: offset, left: offset };
      case 'top-right':
        return { position: 'absolute', top: offset, right: offset };
      case 'bottom-left':
        return { position: 'absolute', bottom: offset, left: offset };
      case 'bottom-right':
      default:
        return { position: 'absolute', bottom: offset, right: offset };
      case 'center':
        return { alignSelf: 'center' };
    }
  };

  const sizeStyles = getSizeStyles();
  const gradientColors = getVariantColors();
  const positionStyles = getPositionStyles();

  const iconSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;

  const buttonStyle = {
    ...sizeStyles,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.6 : 1,
    ...platformShadow(Shadows.components.fab),
    ...(extended && {
      width: 'auto',
      minWidth: sizeStyles.width,
      paddingHorizontal: 16,
      borderRadius: sizeStyles.height / 2,
    }),
    ...style,
  };

  const containerStyles = {
    ...positionStyles,
    ...containerStyle,
  };

  const renderContent = () => {
    if (extended && label) {
      return (
        <View className="flex-row items-center">
          {icon && (
            <View className="mr-2">
              {React.cloneElement(icon, {
                color: EnvironmentColors.background.primary,
                size: iconSize,
              })}
            </View>
          )}
          <Text
            style={[
              Typography.styles.button,
              { color: EnvironmentColors.background.primary, fontWeight: '600' },
            ]}
          >
            {label}
          </Text>
        </View>
      );
    }

    return React.cloneElement(icon, {
      color: EnvironmentColors.background.primary,
      size: iconSize,
    });
  };

  return (
    <View style={containerStyles}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={buttonStyle}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// Extended FAB component for specific use cases
export function ExtendedFAB({ label, icon, ...props }) {
  return (
    <FloatingActionButton
      extended={true}
      label={label}
      icon={icon}
      {...props}
    />
  );
}

// Multi-action FAB with expandable menu
export function MultiFAB({
  mainIcon,
  actions = [],
  isOpen = false,
  onToggle,
  variant = 'forest',
  ...props
}) {
  const [expanded, setExpanded] = React.useState(isOpen);
  
  React.useEffect(() => {
    setExpanded(isOpen);
  }, [isOpen]);

  const toggleExpanded = () => {
    const newState = !expanded;
    setExpanded(newState);
    onToggle && onToggle(newState);
  };

  return (
    <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
      {/* Action items */}
      {expanded && actions.map((action, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            bottom: (index + 1) * 70,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {action.label && (
            <View
              style={{
                backgroundColor: EnvironmentColors.background.primary,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 12,
                ...platformShadow(Shadows.elevation[2]),
              }}
            >
              <Text style={[Typography.styles.caption, { color: EnvironmentColors.neutral[700] }]}>
                {action.label}
              </Text>
            </View>
          )}
          <FloatingActionButton
            icon={action.icon}
            onPress={action.onPress}
            size="small"
            variant={variant}
            position="center"
          />
        </View>
      ))}
      
      {/* Main FAB */}
      <FloatingActionButton
        icon={mainIcon}
        onPress={toggleExpanded}
        variant={variant}
        position="center"
        style={{
          transform: [{ rotate: expanded ? '45deg' : '0deg' }],
        }}
        {...props}
      />
    </View>
  );
}