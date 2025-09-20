// Mindfulness-inspired design system for farming app
export const theme = {
  colors: {
    // Primary calming palette
    primary: '#A8DADC',      // Soft teal
    primaryLight: '#E8F4F8', // Very light teal
    primaryDark: '#6B9AC4',  // Deeper teal

    // Secondary calming colors
    secondary: '#F4A261',    // Warm orange
    secondaryLight: '#FDE8D0', // Light orange
    secondaryDark: '#E76F51',  // Deep orange

    // Neutral calming tones
    background: '#FFFFFF',   // Pure white
    surface: '#F8FAFC',      // Very light gray
    surfaceLight: '#F1F5F9', // Light gray
    surfaceDark: '#E2E8F0',  // Medium gray

    // Text colors
    textPrimary: '#1E293B',  // Dark slate
    textSecondary: '#64748B', // Medium gray
    textLight: '#94A3B8',    // Light gray
    textWhite: '#FFFFFF',    // White text

    // Status colors (calming versions)
    success: '#10B981',      // Soft green
    successLight: '#D1FAE5', // Light green
    warning: '#F59E0B',      // Soft amber
    warningLight: '#FEF3C7', // Light amber
    error: '#EF4444',        // Soft red
    errorLight: '#FEE2E2',   // Light red
    info: '#3B82F6',         // Soft blue
    infoLight: '#DBEAFE',    // Light blue

    // Gradients
    gradientPrimary: ['#A8DADC', '#6B9AC4'],
    gradientSecondary: ['#F4A261', '#E76F51'],
    gradientBackground: ['#F8FAFC', '#E2E8F0'],
    gradientCard: ['#FFFFFF', '#F8FAFC'],
  },

  typography: {
    // Font sizes
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 14,
    body: 16,
    caption: 12,
    small: 10,

    // Font weights
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',

    // Line heights
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

// Utility functions for consistent styling
export const getStatusColor = (status) => {
  const statusMap = {
    optimal: theme.colors.success,
    good: theme.colors.info,
    excellent: theme.colors.success,
    normal: theme.colors.info,
    high: theme.colors.warning,
    low: theme.colors.error,
    recommended: theme.colors.success,
    popular: theme.colors.info,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
    info: theme.colors.info,
  };
  return statusMap[status.toLowerCase()] || theme.colors.textSecondary;
};

export const getStatusBackground = (status) => {
  const statusMap = {
    optimal: theme.colors.successLight,
    good: theme.colors.infoLight,
    excellent: theme.colors.successLight,
    normal: theme.colors.infoLight,
    high: theme.colors.warningLight,
    low: theme.colors.errorLight,
    recommended: theme.colors.successLight,
    popular: theme.colors.infoLight,
    success: theme.colors.successLight,
    warning: theme.colors.warningLight,
    error: theme.colors.errorLight,
    info: theme.colors.infoLight,
  };
  return statusMap[status.toLowerCase()] || theme.colors.surfaceLight;
};