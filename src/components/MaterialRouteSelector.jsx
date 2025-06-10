import React from 'react';
import {
  Box,
  Text,
  HStack,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import { ChevronDown, MapPin, Route, Navigation } from 'lucide-react';



// Material Design Route Selector Component
const MaterialRouteSelector = ({ value, onChange }) => {
  const routes = [
    { value: 'all', label: 'Todas las rutas', icon: <Navigation size={16} />, color: 'blue.500' },
    { value: 'ruta 1', label: 'Ruta 1 - Centro', icon: <MapPin size={16} />, color: 'green.500' },
    { value: 'ruta 2', label: 'Ruta 2 - Norte', icon: <Route size={16} />, color: 'orange.500' },
    { value: 'ruta 3', label: 'Ruta 3 - Sur', icon: <MapPin size={16} />, color: 'purple.500' }
  ];

  const selectedRoute = routes.find(route => route.value === value) || routes[0];

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDown size={16} />}
        w="100%"
        h="40px"
        bg={useColorModeValue('white', '#2a2f3a')}
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'transparent')}
        borderRadius="12px"
        fontSize="14px"
        fontWeight="500"
        color={useColorModeValue('gray.700', '#e2e8f0')}
        transition="all 0.2s"
        _hover={{
          borderColor: useColorModeValue('blue.400', 'primary.600'),
          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none'),
          transform: 'translateY(-1px)',
          bg: useColorModeValue('gray.50', '#2f3441')
        }}
        _active={{
          borderColor: useColorModeValue('blue.500', 'primary.500'),
          boxShadow: useColorModeValue('0 0 0 2px rgba(66, 153, 225, 0.6)', 'none')
        }}
        _focus={{
          borderColor: useColorModeValue('blue.500', 'primary.500'),
          boxShadow: useColorModeValue('0 0 0 2px rgba(66, 153, 225, 0.6)', 'none')
        }}
      >
        <HStack spacing={3} w="100%" justify="flex-start">
          <Box color={selectedRoute.color}>
            {selectedRoute.icon}
          </Box>
          <Text color={useColorModeValue('gray.700', '#e2e8f0')}>{selectedRoute.label}</Text>
        </HStack>
      </MenuButton>
      <Portal>
        <MenuList
          bg={useColorModeValue('white', '#2f3441')}
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'transparent')}
          borderRadius="12px"
          boxShadow={useColorModeValue('0 10px 25px rgba(0,0,0,0.15)', '0 10px 25px rgba(0,0,0,0.3)')}
          p={2}
          minW="280px"
        >
          {routes.map((route, index) => (
            <MenuItem
              key={route.value}
              onClick={() => onChange(route.value)}
              bg={value === route.value ? 
                useColorModeValue('blue.50', 'primary.800') : 
                useColorModeValue('transparent', 'transparent')
              }
              borderRadius="8px"
              px={3}
              py={2}
              mb={index < routes.length - 1 ? 1 : 0}
              transition="all 0.2s"
              color={useColorModeValue('gray.700', '#e2e8f0')}
              _hover={{
                bg: value === route.value ? 
                  useColorModeValue('blue.100', 'primary.700') : 
                  useColorModeValue('gray.50', '#35394a')
              }}
            >
              <HStack spacing={3}>
                <Box color={route.color}>
                  {route.icon}
                </Box>
                <Text 
                  fontWeight={value === route.value ? "600" : "400"}
                  color={useColorModeValue('gray.700', '#e2e8f0')}
                >
                  {route.label}
                </Text>
                {value === route.value && (
                  <Box ml="auto">
                    <Box w={2} h={2} bg="blue.500" borderRadius="full" />
                  </Box>
                )}
              </HStack>
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default MaterialRouteSelector;