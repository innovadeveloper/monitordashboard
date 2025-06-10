import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';
import { 
  Construction
} from 'lucide-react';
import { TopBar } from '../ui';

const Module3 = () => {
  // Color mode values
  const bgColor = useColorModeValue('app.bg.primary', 'app.bg.primary');
  const cardBg = useColorModeValue('white', '#2f3441');
  const textColor = useColorModeValue('gray.800', '#e2e8f0');
  const secondaryTextColor = useColorModeValue('gray.600', '#a0aec0');

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <TopBar />

      {/* Main Content - Under Construction */}
      <Center h="calc(100vh - 80px)">
        <VStack spacing={8}>
          <Box
            bg={cardBg}
            p={12}
            borderRadius="2xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            boxShadow="xl"
            textAlign="center"
          >
            <VStack spacing={6}>
              {/* Construction Icon */}
              <Box
                p={6}
                bg={useColorModeValue('orange.100', 'orange.900')}
                borderRadius="full"
                border="3px solid"
                borderColor={useColorModeValue('orange.200', 'orange.700')}
              >
                <Construction size={64} color={useColorModeValue('#D69E2E', '#FBD38D')} />
              </Box>

              {/* Main Message */}
              <VStack spacing={3}>
                <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                  Módulo en Construcción
                </Text>
                <Text fontSize="lg" color={secondaryTextColor} maxW="400px">
                  Este módulo está actualmente en desarrollo. Pronto estará disponible con nuevas funcionalidades.
                </Text>
              </VStack>

              {/* Status Info */}
              <Box
                bg={useColorModeValue('blue.50', 'blue.900')}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor={useColorModeValue('blue.200', 'blue.700')}
              >
                <HStack spacing={4} justify="center">
                  <Box textAlign="center">
                    <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('blue.700', 'blue.200')}>
                      Estado del Proyecto
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('blue.600', 'blue.300')}>
                      25% Completado
                    </Text>
                  </Box>
                  <Box h="40px" w="1px" bg={useColorModeValue('blue.300', 'blue.600')} />
                  <Box textAlign="center">
                    <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('blue.700', 'blue.200')}>
                      Fecha Estimada
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('blue.600', 'blue.300')}>
                      Q1 2025
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};

export default Module3;