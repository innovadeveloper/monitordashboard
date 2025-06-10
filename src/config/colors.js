// GPS Fleet Monitoring - Color Configuration
// Customize these colors to match your brand and preferences

export const colorTokens = {
  // Light Theme Colors
  light: {
    // Background Colors
    background: {
      primary: '#f7fafc',        // Main app background
      secondary: '#ffffff',      // Cards, panels, sidebars
      tertiary: '#f1f5f9',      // Subtle backgrounds, hover states
      accent: '#e2e8f0',         // Borders, dividers
    },
    
    // Text Colors
    text: {
      primary: '#1a202c',        // Main text, headings
      secondary: '#4a5568',      // Subtext, descriptions
      tertiary: '#718096',       // Placeholders, disabled text
      inverse: '#ffffff',        // Text on dark backgrounds
    },
    
    // UI Element Colors
    surface: {
      card: '#ffffff',           // Cards, modals
      input: '#ffffff',          // Form inputs
      button: '#f7fafc',         // Button backgrounds
      sidebar: '#ffffff',        // Sidebar background
      header: '#1a202c',         // Header background
    },
    
    // Status Colors
    status: {
      active: '#38a169',         // Green - Active/Success
      warning: '#ed8936',        // Orange - Warning
      error: '#e53e3e',          // Red - Error/Critical
      info: '#3182ce',           // Blue - Info
      neutral: '#718096',        // Gray - Neutral
    },
    
    // Brand Colors
    brand: {
      primary: '#3182ce',        // Main brand color (blue)
      secondary: '#2b6cb0',      // Darker brand variant
      accent: '#63b3ed',         // Lighter brand variant
      gradient: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)',
    },
    
    // Semantic Colors
    semantic: {
      bus: {
        active: '#38a169',       // Green for active buses
        warning: '#ed8936',      // Orange for delayed buses
        error: '#e53e3e',        // Red for offline/error buses
        route: '#3182ce',        // Blue for route lines
      },
      map: {
        background: '#f7fafc',
        route: '#3182ce',
        marker: '#2b6cb0',
      }
    }
  },

  // Dark Theme Colors
  dark: {
    // Background Colors
    background: {
      primary: '#1a1d29',        // Main app background (azul oscuro profundo)
      secondary: '#242938',      // Cards, panels, sidebars (gris azulado)
      tertiary: '#2d3748',       // Subtle backgrounds, hover states (gris medio)
      accent: '#4a5568',         // Borders, dividers
    },
    
    // Text Colors
    text: {
      primary: '#f7fafc',        // Main text, headings (blanco suave)
      secondary: '#a0aec0',      // Subtext, descriptions (gris claro)
      tertiary: '#718096',       // Placeholders, disabled text
      inverse: '#1a202c',        // Text on light backgrounds
    },
    
    // UI Element Colors
    surface: {
      card: '#242938',           // Cards, modals
      input: '#2d3748',          // Form inputs
      button: '#2d3748',         // Button backgrounds
      sidebar: '#242938',        // Sidebar background
      header: '#1a1d29',         // Header background
    },
    
    // Status Colors (brighter for dark theme)
    status: {
      active: '#48bb78',         // Brighter green
      warning: '#ed8936',        // Orange
      error: '#f56565',          // Brighter red
      info: '#4299e1',           // Brighter blue
      neutral: '#a0aec0',        // Light gray
    },
    
    // Brand Colors (adjusted for dark theme)
    brand: {
      primary: '#4299e1',        // Brighter blue for dark theme
      secondary: '#3182ce',      // Standard blue
      accent: '#90cdf4',         // Light blue accent
      gradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    },
    
    // Semantic Colors
    semantic: {
      bus: {
        active: '#48bb78',       // Brighter green for active buses
        warning: '#ed8936',      // Orange for delayed buses
        error: '#f56565',        // Brighter red for offline/error buses
        route: '#4299e1',        // Brighter blue for route lines
      },
      map: {
        background: '#2d3748',
        route: '#4299e1',
        marker: '#90cdf4',
      }
    }
  }
};

// Helper function to get colors based on current theme
export const getColors = (theme = 'light') => {
  return colorTokens[theme] || colorTokens.light;
};

// Color utilities
export const colorUtils = {
  // Add opacity to any color
  withOpacity: (color, opacity) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  
  // Generate hover states
  hover: {
    light: (color) => color + '15', // Add 15% opacity
    dark: (color) => color + '25',  // Add 25% opacity for better visibility
  },
  
  // Generate focus states
  focus: {
    light: (color) => color + '30',
    dark: (color) => color + '40',
  }
};

export default colorTokens;