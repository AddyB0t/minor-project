// Professional spacing system following Instagram's design patterns
export const Spacing = {
  // Base spacing unit (4px - Instagram's base unit)
  baseUnit: 4,

  // Spacing scale
  space: {
    0: 0,
    1: 4,   // 0.25rem
    2: 8,   // 0.5rem  
    3: 12,  // 0.75rem
    4: 16,  // 1rem
    5: 20,  // 1.25rem
    6: 24,  // 1.5rem
    8: 32,  // 2rem
    10: 40, // 2.5rem
    12: 48, // 3rem
    16: 64, // 4rem
    20: 80, // 5rem
    24: 96, // 6rem
    32: 128, // 8rem
    40: 160, // 10rem
    48: 192, // 12rem
    56: 224, // 14rem
    64: 256  // 16rem
  },

  // Common padding presets for components
  padding: {
    // Button padding
    buttonSmall: { paddingVertical: 8, paddingHorizontal: 12 },
    buttonMedium: { paddingVertical: 12, paddingHorizontal: 16 },
    buttonLarge: { paddingVertical: 16, paddingHorizontal: 24 },

    // Card padding
    cardSmall: { padding: 12 },
    cardMedium: { padding: 16 },
    cardLarge: { padding: 24 },

    // Screen padding (Instagram-style)
    screenHorizontal: { paddingHorizontal: 16 },
    screenVertical: { paddingVertical: 16 },
    screen: { padding: 16 },

    // Input padding
    input: { paddingVertical: 12, paddingHorizontal: 16 },
    inputSmall: { paddingVertical: 8, paddingHorizontal: 12 },

    // Chat message padding
    chatBubble: { paddingVertical: 8, paddingHorizontal: 12 },
    chatInput: { paddingVertical: 12, paddingHorizontal: 16 },

    // Navigation padding
    tabBar: { paddingVertical: 8, paddingHorizontal: 16 },
    header: { paddingVertical: 12, paddingHorizontal: 16 },

    // Table padding
    tableCell: { paddingVertical: 12, paddingHorizontal: 16 },
    tableHeader: { paddingVertical: 8, paddingHorizontal: 16 }
  },

  // Common margin presets
  margin: {
    // Component spacing
    componentSmall: { margin: 8 },
    componentMedium: { margin: 16 },
    componentLarge: { margin: 24 },

    // Element spacing
    elementTiny: { margin: 4 },
    elementSmall: { margin: 8 },
    elementMedium: { margin: 12 },
    elementLarge: { margin: 16 },

    // Section spacing
    sectionSmall: { marginVertical: 16 },
    sectionMedium: { marginVertical: 24 },
    sectionLarge: { marginVertical: 32 },

    // Instagram-specific spacing
    postSpacing: { marginBottom: 24 },
    storySpacing: { marginHorizontal: 8 },
    feedItemSpacing: { marginVertical: 12 }
  },

  // Gap spacing for flex containers
  gap: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32
  },

  // Border radius values (Instagram-style)
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
    
    // Component-specific radius
    button: 8,
    card: 12,
    input: 8,
    avatar: 9999,
    story: 9999,
    chatBubble: 18,
    fab: 9999
  },

  // Layout dimensions
  dimensions: {
    // Header heights
    headerHeight: 56,
    tabBarHeight: 60,
    
    // Button heights
    buttonSmall: 32,
    buttonMedium: 40,
    buttonLarge: 48,
    
    // Avatar sizes
    avatarSmall: 32,
    avatarMedium: 40,
    avatarLarge: 56,
    avatarXLarge: 80,
    
    // Story sizes
    storySmall: 56,
    storyMedium: 64,
    storyLarge: 80,
    
    // Input heights
    inputHeight: 48,
    inputSmallHeight: 40,
    
    // Icon sizes
    iconSmall: 16,
    iconMedium: 20,
    iconLarge: 24,
    iconXLarge: 32,
    
    // Floating Action Button
    fabSize: 56,
    fabSmallSize: 40,
    
    // Minimum touch target (accessibility)
    minTouchTarget: 44
  },

  // Instagram-specific layout constants
  instagram: {
    // Feed post image aspect ratio
    postAspectRatio: 1,
    
    // Story dimensions
    storyWidth: 64,
    storyHeight: 64,
    
    // Tab bar
    tabBarHeight: 49,
    tabIconSize: 24,
    
    // Header
    headerHeight: 44,
    
    // Common spacings used in Instagram
    feedPadding: 16,
    storyPadding: 8,
    postActionsPadding: 12,
    commentsPadding: 16
  }
};

// Helper functions for consistent spacing
export const getSpacing = (size) => Spacing.space[size] || size;
export const getPadding = (type) => Spacing.padding[type] || {};
export const getMargin = (type) => Spacing.margin[type] || {};
export const getBorderRadius = (size) => Spacing.borderRadius[size] || size;

// Common layout helpers
export const layoutHelpers = {
  // Flex shortcuts
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexBetween: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flexStart: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  flexEnd: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  
  // Row layouts
  row: {
    flexDirection: 'row'
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  // Full width/height
  fullWidth: {
    width: '100%'
  },
  fullHeight: {
    height: '100%'
  },
  fullSize: {
    width: '100%',
    height: '100%'
  }
};

// Component-specific spacing for easier imports (backward compatibility)
export const ComponentSpacing = {
  card: {
    small: 12,
    medium: 16,
    large: 24
  },
  table: {
    cellPadding: 16,
    rowPadding: 12,
    outerPadding: 16
  },
  button: {
    small: { paddingVertical: 8, paddingHorizontal: 12 },
    medium: { paddingVertical: 12, paddingHorizontal: 16 },
    large: { paddingVertical: 16, paddingHorizontal: 24 }
  },
  chat: {
    bubble: { paddingVertical: 8, paddingHorizontal: 12 },
    input: { paddingVertical: 12, paddingHorizontal: 16 }
  }
};

export default Spacing;