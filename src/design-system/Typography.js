// Professional typography system inspired by Instagram
export const Typography = {
  // Font families
  fontFamily: {
    primary: 'System', // Uses system font like Instagram
    secondary: 'System',
    monospace: 'Courier New'
  },

  // Font sizes (following Instagram's scale)
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48
  },

  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 56
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },

  // Pre-defined text styles for consistency
  styles: {
    // Headers
    h1: {
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '700',
      letterSpacing: -0.5
    },
    h2: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
      letterSpacing: -0.25
    },
    h3: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600',
      letterSpacing: 0
    },
    h4: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600',
      letterSpacing: 0
    },

    // Body text
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      letterSpacing: 0
    },
    bodyMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
      letterSpacing: 0
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: 0
    },

    // Instagram-specific styles
    username: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
      letterSpacing: 0
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: 0
    },
    timestamp: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      letterSpacing: 0,
      opacity: 0.7
    },

    // Button text
    buttonLarge: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '600',
      letterSpacing: 0
    },
    buttonMedium: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
      letterSpacing: 0
    },
    buttonSmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      letterSpacing: 0
    },

    // Navigation
    tabLabel: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '500',
      letterSpacing: 0
    },
    tabLabelActive: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '600',
      letterSpacing: 0
    },

    // Form elements
    inputLabel: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0
    },
    inputText: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      letterSpacing: 0
    },
    placeholder: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      letterSpacing: 0,
      opacity: 0.6
    },

    // Table text
    tableHeader: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
      textTransform: 'uppercase'
    },
    tableCell: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: 0
    },

    // Chat specific
    chatMessage: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '400',
      letterSpacing: 0
    },
    chatTimestamp: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '400',
      letterSpacing: 0,
      opacity: 0.6
    }
  }
};

// Helper function to create text style objects
export const createTextStyle = (size, weight = 'normal', color = '#1E293B') => ({
  fontSize: Typography.fontSize[size] || size,
  fontWeight: Typography.fontWeight[weight] || weight,
  color: color,
  lineHeight: Typography.lineHeight[size] || Typography.lineHeight.base
});

export default Typography;