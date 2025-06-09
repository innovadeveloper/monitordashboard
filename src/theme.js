// src/theme.js - Actualización con colores primarios
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Color primario principal
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985', // Dark primary
      900: '#0c4a6e',
    },
    gray: {
      800: '#2d3748', // Mantenemos consistencia con Chakra
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
          bg: 'primary.800',
          color: 'white',
          _hover: {
            bg: 'primary.700',
          },
          _active: {
            bg: 'primary.600',
          },
        }
      }
    },
    // Customización del scrollbar
    '.custom-scrollbar': {
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f5f9',
        borderRadius: '10px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(180deg, #cbd5e0 0%, #a0aec0 100%)',
        borderRadius: '10px',
        border: '2px solid #f1f5f9',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'linear-gradient(180deg, #a0aec0 0%, #718096 100%)',
      },
    }
  },
  styles: {
    global: {
      // Scrollbar global styles
      '*': {
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f5f9',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, #cbd5e0 0%, #a0aec0 100%)',
          borderRadius: '10px',
          border: '2px solid #f1f5f9',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'linear-gradient(180deg, #a0aec0 0%, #718096 100%)',
        },
      }
    }
  }
});

export default theme;