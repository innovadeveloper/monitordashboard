import React from 'react';
import { useDrag } from 'react-dnd';
import {
  Box,
  Text,
  HStack,
  VStack,
  Badge,
} from '@chakra-ui/react';

const DraggableBusItem = ({ bus }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'bus',
    item: bus,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'warning': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'active': return 'green.500';
      case 'warning': return 'orange.500';
      case 'critical': return 'red.500';
      default: return 'gray.500';
    }
  };

  return (
    <Box
      ref={drag}
      p={3}
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      cursor="grab"
      opacity={isDragging ? 0.5 : 1}
      _hover={{ 
        borderColor: 'blue.300',
        boxShadow: 'sm',
        transform: 'translateY(-1px)',
      }}
      transition="all 0.2s"
      position="relative"
    >
      <HStack justify="space-between" align="start">
        <VStack align="start" spacing={1} flex={1}>
          <HStack>
            <Text fontWeight="bold" fontSize="sm" color="gray.800">
              {bus.id}
            </Text>
            <Box
              w={2}
              h={2}
              bg={getStatusDot(bus.status)}
              borderRadius="full"
            />
          </HStack>
          <Text fontSize="xs" color="gray.600">
            {bus.driver} • {bus.time}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {bus.route} • {bus.terminal}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default DraggableBusItem;