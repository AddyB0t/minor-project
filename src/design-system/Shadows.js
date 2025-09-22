// Professional shadow system inspired by Instagram's depth hierarchy
export const Shadows = {
  // Base shadow values for different elevations
  elevation: {
    0: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0
    },
    1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2
    },
    3: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3
    },
    4: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4
    },
    5: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5
    },
    6: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 6
    }
  },

  // Component-specific shadows (Instagram-style)
  components: {
    // Button shadows
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    buttonPressed: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },

    // Card shadows
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2
    },
    cardHover: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 3
    },

    // Instagram post card
    postCard: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1
    },

    // Story ring shadow
    story: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },

    // Chat bubble shadows
    chatBubble: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 1
    },
    chatBubbleUser: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },

    // Floating Action Button
    fab: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4
    },
    fabPressed: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },

    // Input field shadow (subtle)
    input: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 2,
      elevation: 1
    },
    inputFocused: {
      shadowColor: '#22C55E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2
    },

    // Modal shadows
    modal: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 6
    },

    // Header shadow
    header: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1
    },

    // Tab bar shadow
    tabBar: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2
    },

    // Table row hover
    tableRowHover: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1
    },

    // Dropdown shadow
    dropdown: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 3
    }
  },

  // Colored shadows for special effects
  colored: {
    // Success/green shadows
    success: {
      shadowColor: '#22C55E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 2
    },
    
    // Warning/orange shadows
    warning: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 2
    },
    
    // Error/red shadows
    error: {
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 2
    },
    
    // Primary blue shadow
    primary: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 2
    },
    
    // Instagram gradient shadow
    instagram: {
      shadowColor: '#E1306C',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3
    }
  },

  // Inner shadows (for pressed states, inputs)
  inner: {
    input: {
      // Note: React Native doesn't support inner shadows natively
      // This would need to be implemented with overlay components
      // or using react-native-shadow-2 library
      inset: true,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2
    }
  }
};

// Helper functions for applying shadows
export const applyShadow = (elevation) => {
  return Shadows.elevation[elevation] || Shadows.elevation[0];
};

export const applyComponentShadow = (component) => {
  return Shadows.components[component] || Shadows.elevation[0];
};

export const applyColoredShadow = (color) => {
  return Shadows.colored[color] || Shadows.elevation[0];
};

// Shadow presets for common use cases
export const shadowPresets = {
  // Cards
  flatCard: Shadows.elevation[0],
  raisedCard: Shadows.elevation[1],
  hoveredCard: Shadows.elevation[2],
  
  // Buttons
  flatButton: Shadows.elevation[0],
  raisedButton: Shadows.elevation[1],
  pressedButton: Shadows.components.buttonPressed,
  
  // Floating elements
  tooltip: Shadows.elevation[3],
  modal: Shadows.components.modal,
  fab: Shadows.components.fab,
  
  // Navigation
  header: Shadows.components.header,
  tabBar: Shadows.components.tabBar
};

// Platform-specific shadow helpers
export const platformShadow = (shadowStyle) => {
  // iOS uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
  // Android uses elevation
  return {
    ...shadowStyle,
    // Ensure elevation is present for Android
    elevation: shadowStyle.elevation || 0
  };
};

export default Shadows;