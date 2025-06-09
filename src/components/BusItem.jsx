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



// BusItem Component with native drag & drop
const BusItem = ({ bus, isSelected, onClick, onDragStart }) => {
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'active': return 'green.500';
      case 'warning': return 'orange.500';
      case 'error': return 'red.500';
      default: return 'green.500';
    }
  };

  return (
    <Box
      p={3}
      mb={2}
      bg={isSelected ? 'blue.50' : 'white'}
      border="1px"
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      borderRadius="md"
      cursor="grab"
      transition="all 0.2s"
      position="relative"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      _hover={{
        borderColor: 'blue.500',
        transform: 'translateY(-1px)',
        boxShadow: 'md'
      }}
      _active={{ cursor: 'grabbing' }}
    >
      <Box
        position="absolute"
        top={3}
        right={3}
        w={2.5}
        h={2.5}
        bg={getStatusColor(bus.estado)}
        borderRadius="full"
      />

      <Text fontWeight="600" color="gray.800" mb={1}>
        {bus.id}
      </Text>
      <Text fontSize="xs" color="gray.600" mb={1}>
        {bus.conductor} • {bus.tiempo}
      </Text>
      <Text fontSize="xs" color="gray.500">
        {bus.ruta}
      </Text>

      {bus.alertas > 0 && (
        <Badge
          position="absolute"
          top={1}
          right={7}
          colorScheme="red"
          fontSize="9px"
          borderRadius="full"
        >
          {bus.alertas}
        </Badge>
      )}
    </Box>
  );
};

export default BusItem;