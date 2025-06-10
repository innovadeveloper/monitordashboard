import React from 'react';
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Center,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { 
  MapPin,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';
import { TopBar } from '../ui';

const Dashboard = () => {
  // Color mode values
  const bgColor = useColorModeValue('app.bg.primary', 'app.bg.primary');
  const cardBg = useColorModeValue('white', '#2f3441');
  const textColor = useColorModeValue('gray.800', '#e2e8f0');
  const secondaryTextColor = useColorModeValue('gray.600', '#a0aec0');

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <TopBar />

      {/* Main Content - Centered Welcome Widget */}
      <Center h="calc(100vh - 80px)">
        <VStack spacing={8}>
          <Box
            bg={cardBg}
            p={12}
            borderRadius="3xl"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            boxShadow="2xl"
            textAlign="center"
            maxW="600px"
          >
            <VStack spacing={8}>
              {/* App Icon/Logo */}
              <Box
                p={6}
                bg={useColorModeValue('blue.100', 'blue.900')}
                borderRadius="full"
                border="3px solid"
                borderColor={useColorModeValue('blue.200', 'blue.700')}
              >
                <Box fontSize="4xl">🚌</Box>
              </Box>

              {/* Main Title */}
              <VStack spacing={4}>
                <Text fontSize="4xl" fontWeight="bold" color={textColor}>
                  Monitoreo GPS y Flota
                </Text>
                <Text fontSize="xl" color={secondaryTextColor} maxW="500px" lineHeight="1.6">
                  Sistema integral de gestión y monitoreo para flotas de transporte urbano
                </Text>
              </VStack>

              {/* Features Grid */}
              <HStack spacing={8} justify="center" wrap="wrap">
                <VStack spacing={2}>
                  <Box p={3} bg={useColorModeValue('green.100', 'green.900')} borderRadius="lg">
                    <MapPin size={24} color={useColorModeValue('#38A169', '#68D391')} />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    Monitoreo GPS
                  </Text>
                  <Badge colorScheme="green" size="sm">Tiempo Real</Badge>
                </VStack>

                <VStack spacing={2}>
                  <Box p={3} bg={useColorModeValue('purple.100', 'purple.900')} borderRadius="lg">
                    <BarChart3 size={24} color={useColorModeValue('#805AD5', '#B794F6')} />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    Analytics
                  </Text>
                  <Badge colorScheme="purple" size="sm">Avanzado</Badge>
                </VStack>

                <VStack spacing={2}>
                  <Box p={3} bg={useColorModeValue('orange.100', 'orange.900')} borderRadius="lg">
                    <Shield size={24} color={useColorModeValue('#DD6B20', '#FBD38D')} />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    Seguridad
                  </Text>
                  <Badge colorScheme="orange" size="sm">24/7</Badge>
                </VStack>

                <VStack spacing={2}>
                  <Box p={3} bg={useColorModeValue('teal.100', 'teal.900')} borderRadius="lg">
                    <Settings size={24} color={useColorModeValue('#319795', '#81E6D9')} />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    Control
                  </Text>
                  <Badge colorScheme="teal" size="sm">Completo</Badge>
                </VStack>
              </HStack>

              {/* Version Info */}
              <Box
                bg={useColorModeValue('gray.50', 'gray.700')}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <HStack spacing={4} justify="center">
                  <Box textAlign="center">
                    <Text fontSize="xs" color={secondaryTextColor} fontWeight="semibold">
                      VERSIÓN
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      v2.1.0
                    </Text>
                  </Box>
                  <Box h="30px" w="1px" bg={useColorModeValue('gray.300', 'gray.600')} />
                  <Box textAlign="center">
                    <Text fontSize="xs" color={secondaryTextColor} fontWeight="semibold">
                      ESTADO
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="green.500">
                      Operativo
                    </Text>
                  </Box>
                  <Box h="30px" w="1px" bg={useColorModeValue('gray.300', 'gray.600')} />
                  <Box textAlign="center">
                    <Text fontSize="xs" color={secondaryTextColor} fontWeight="semibold">
                      ÚLTIMA ACT.
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      Hoy
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

export default Dashboard;