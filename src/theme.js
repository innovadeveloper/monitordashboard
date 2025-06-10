// src/theme.js - GPS Fleet Monitoring Theme Configuration
import { extendTheme } from '@chakra-ui/react';
import { colorTokens } from './config/colors';

const createThemeColors = (mode) => {
  const colors = colorTokens[mode];
  
  return {
    // Chakra UI compatible color scales
    primary: {
      50: mode === 'light' ? '#f0f9ff' : '#0c4a6e',
      100: mode === 'light' ? '#e0f2fe' : '#075985',
      200: mode === 'light' ? '#bae6fd' : '#0369a1',
      300: mode === 'light' ? '#7dd3fc' : '#0284c7',
      400: mode === 'light' ? '#38bdf8' : '#0ea5e9',
      500: colors.brand.primary,
      600: colors.brand.secondary,
      700: mode === 'light' ? '#0369a1' : '#38bdf8',
      800: mode === 'light' ? '#075985' : '#7dd3fc',
      900: mode === 'light' ? '#0c4a6e' : '#f0f9ff',
    },
    
    // Custom semantic colors
    app: {
      bg: {
        primary: colors.background.primary,
        secondary: colors.background.secondary,
        tertiary: colors.background.tertiary,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        tertiary: colors.text.tertiary,
      },
      surface: {
        card: colors.surface.card,
        input: colors.surface.input,
        sidebar: colors.surface.sidebar,
        header: colors.surface.header,
      },
      status: colors.status,
      brand: colors.brand,
    },
    
    // Bus-specific colors
    bus: colors.semantic.bus,
    
    // Map colors
    map: colors.semantic.map,
  };
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  
  colors: createThemeColors('light'),
  
  semanticTokens: {
    colors: {
      // Dynamic colors that change with theme
      'app.bg.primary': {
        default: colorTokens.light.background.primary,
        _dark: colorTokens.dark.background.primary,
      },
      'app.bg.secondary': {
        default: colorTokens.light.background.secondary,
        _dark: colorTokens.dark.background.secondary,
      },
      'app.text.primary': {
        default: colorTokens.light.text.primary,
        _dark: colorTokens.dark.text.primary,
      },
      'app.text.secondary': {
        default: colorTokens.light.text.secondary,
        _dark: colorTokens.dark.text.secondary,
      },
      'app.surface.card': {
        default: colorTokens.light.surface.card,
        _dark: colorTokens.dark.surface.card,
      },
      'app.surface.header': {
        default: colorTokens.light.surface.header,
        _dark: colorTokens.dark.surface.header,
      },
      'app.status.active': {
        default: colorTokens.light.status.active,
        _dark: colorTokens.dark.status.active,
      },
      'app.status.warning': {
        default: colorTokens.light.status.warning,
        _dark: colorTokens.dark.status.warning,
      },
      'app.status.error': {
        default: colorTokens.light.status.error,
        _dark: colorTokens.dark.status.error,
      },
    }
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
          },
          _active: {
            bg: 'primary.700',
          },
        },
        videoPrimary: {
          bg: 'primary.600',
          color: 'white',
          _hover: {
            bg: 'primary.500',
          },
          _active: {
            bg: 'primary.700',
          },
        }
      }
    },
    
    // Card component customization
    Card: {
      baseStyle: {
        container: {
          bg: 'app.surface.card',
          borderColor: 'app.bg.tertiary',
        }
      }
    },
    
    // Input component customization  
    Input: {
      baseStyle: {
        field: {
          bg: 'app.surface.input',
          borderColor: 'app.bg.tertiary',
          color: 'app.text.primary',
          _placeholder: {
            color: 'app.text.tertiary',
          }
        }
      }
    }
  },
  
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? colorTokens.dark.background.primary : colorTokens.light.background.primary,
        color: props.colorMode === 'dark' ? colorTokens.dark.text.primary : colorTokens.light.text.primary,
      },
      
      // Scrollbar styles that adapt to theme
      '*': {
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: props.colorMode === 'dark' ? colorTokens.dark.background.tertiary : '#f1f5f9',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: props.colorMode === 'dark' 
            ? 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)'
            : 'linear-gradient(180deg, #cbd5e0 0%, #a0aec0 100%)',
          borderRadius: '10px',
          border: `2px solid ${props.colorMode === 'dark' ? colorTokens.dark.background.tertiary : '#f1f5f9'}`,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: props.colorMode === 'dark'
            ? 'linear-gradient(180deg, #718096 0%, #4a5568 100%)'
            : 'linear-gradient(180deg, #a0aec0 0%, #718096 100%)',
        },
      }
    })
  }
});

export default theme;