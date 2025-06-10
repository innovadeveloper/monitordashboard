import React from 'react';
import {
  Box,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';



// BusItem Component with native drag & drop
const BusItem = ({ bus, isSelected, onClick, onDragStart }) => {
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'active': return 'app.status.active';
      case 'warning': return 'app.status.warning';
      case 'error': return 'app.status.error';
      default: return 'app.status.active';
    }
  };

  return (
    <Box
      p={3}
      mb={2}
      bg={isSelected ? useColorModeValue('blue.50', 'primary.800') : useColorModeValue('white', '#2a2f3a')}
      border="1px"
      borderColor={isSelected ? useColorModeValue('blue.300', 'primary.600') : useColorModeValue('gray.200', 'transparent')}
      borderRadius="md"
      cursor="grab"
      transition="all 0.2s"
      position="relative"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      _hover={{
        borderColor: useColorModeValue('blue.300', 'primary.600'),
        transform: 'translateY(-1px)',
        boxShadow: useColorModeValue('md', 'none'),
        bg: isSelected ? useColorModeValue('blue.100', 'primary.700') : useColorModeValue('gray.50', '#2f3441')
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

      <Text fontWeight="600" color={useColorModeValue('gray.800', '#e2e8f0')} mb={1}>
        {bus.id}
      </Text>
      <Text fontSize="xs" color={useColorModeValue('gray.600', '#a0aec0')} mb={1}>
        {bus.conductor} • {bus.tiempo}
      </Text>
      <Text fontSize="xs" color={useColorModeValue('gray.500', '#718096')}>
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