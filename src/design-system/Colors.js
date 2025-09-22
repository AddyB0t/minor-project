// Environment-themed color palette inspired by Instagram design principles
export const EnvironmentColors = {
  // Primary Environment Gradients
  gradients: {
    // Forest/Growth theme
    forestGreen: ['#22C55E', '#16A34A'],
    vibrantGreen: ['#34D399', '#10B981'],
    
    // Sky/Water theme  
    skyBlue: ['#3B82F6', '#1D4ED8'],
    oceanBlue: ['#0EA5E9', '#0284C7'],
    
    // Sun/Energy theme
    sunsetOrange: ['#F59E0B', '#D97706'],
    goldenYellow: ['#FDE047', '#FACC15'],
    
    // Earth/Soil theme
    earthBrown: ['#A3A3A3', '#525252'],
    richSoil: ['#78716C', '#57534E'],
    
    // Instagram-inspired accents
    instagramPink: ['#E1306C', '#F56040'],
    instagramPurple: ['#833AB4', '#C13584']
  },

  // Solid Colors
  primary: {
    50: '#F0FDF4',
    100: '#DCFCE7', 
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main brand green
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D'
  },

  secondary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE', 
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main brand blue
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A'
  },

  // Neutral colors for professional look
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  },

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    dark: '#0F172A'
  },

  // Text colors
  text: {
    primary: '#1E293B',
    secondary: '#475569', 
    tertiary: '#64748B',
    inverse: '#FFFFFF',
    muted: '#94A3B8'
  },

  // Instagram-inspired colors for modern feel
  social: {
    like: '#ED4956',
    follow: '#0095F6', 
    message: '#0095F6',
    story: '#E1306C'
  },

  // Environment theme specific colors
  environment: {
    grass: '#22C55E',
    sky: '#3B82F6',
    sun: '#F59E0B',
    soil: '#78716C',
    water: '#0EA5E9',
    flower: '#EC4899',
    leaf: '#16A34A',
    sunset: '#F97316'
  }
};

// Gradient helper functions
export const createGradient = (colors) => ({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  colors: colors
});

export const instagramGradients = {
  story: createGradient(['#E1306C', '#F56040', '#FFDC80']),
  button: createGradient(['#405DE6', '#5851DB', '#833AB4', '#C13584', '#E1306C', '#FD1D1D']),
  background: createGradient(['#F8F8F8', '#FFFFFF'])
};

// Theme variants
export const lightTheme = {
  background: EnvironmentColors.background.primary,
  surface: EnvironmentColors.background.secondary,
  text: EnvironmentColors.text.primary,
  primary: EnvironmentColors.primary[500],
  secondary: EnvironmentColors.secondary[500]
};

export const darkTheme = {
  background: EnvironmentColors.background.dark,
  surface: EnvironmentColors.neutral[800],
  text: EnvironmentColors.text.inverse,
  primary: EnvironmentColors.primary[400],
  secondary: EnvironmentColors.secondary[400]
};

export default EnvironmentColors;