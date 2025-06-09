import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Input,
  Button,
  Badge,
  Grid,
  GridItem,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Divider,
} from '@chakra-ui/react';
import { Bell, User, X, Play, Camera, ZoomIn, Square, ChevronDown, Pause, MapPin, Route, Navigation } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


// 1. Importar los nuevos componentes
import ContextMenu from './ContextMenu';
import EnhancedCameraPanel from './EnhancedCameraPanel';
import { useContextMenu } from '../hooks/useContextMenu';



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
        bg="white"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="12px"
        fontSize="14px"
        fontWeight="500"
        color="gray.700"
        transition="all 0.2s"
        _hover={{
          borderColor: 'blue.400',
          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
          transform: 'translateY(-1px)'
        }}
        _active={{
          borderColor: 'blue.500',
          boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.6)'
        }}
        _focus={{
          borderColor: 'blue.500',
          boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.6)'
        }}
      >
        <HStack spacing={3} w="100%" justify="flex-start">
          <Box color={selectedRoute.color}>
            {selectedRoute.icon}
          </Box>
          <Text>{selectedRoute.label}</Text>
        </HStack>
      </MenuButton>
      <Portal>
        <MenuList
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="12px"
          boxShadow="0 10px 25px rgba(0,0,0,0.15)"
          p={2}
          minW="280px"
        >
          {routes.map((route, index) => (
            <MenuItem
              key={route.value}
              onClick={() => onChange(route.value)}
              bg={value === route.value ? 'blue.50' : 'transparent'}
              borderRadius="8px"
              px={3}
              py={2}
              mb={index < routes.length - 1 ? 1 : 0}
              transition="all 0.2s"
              _hover={{
                bg: value === route.value ? 'blue.100' : 'gray.50'
              }}
            >
              <HStack spacing={3}>
                <Box color={route.color}>
                  {route.icon}
                </Box>
                <Text fontWeight={value === route.value ? "600" : "400"}>
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