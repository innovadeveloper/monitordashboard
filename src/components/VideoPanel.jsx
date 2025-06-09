import React from 'react';
import { useDrop } from 'react-dnd';
import {
  Box,
  Text,
  HStack,
  IconButton,
  Badge,
  VStack,
  Center,
} from '@chakra-ui/react';
import {
  Video,
  Camera,
  ZoomIn,
  X,
  Circle,
  Square,
  Truck,
  Car,
} from 'lucide-react';

const VideoPanel = ({ panel, onBusDrop, onClose }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'bus',
    drop: (item) => onBusDrop(item, panel.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const getCameraIcon = (cameraType) => {
    switch (cameraType) {
      case 'frontal': return <Video size={48} />;
      case 'interior': return <Camera size={48} />;
      case 'lateral': return <Video size={48} />;
      case 'dashboard': return <Car size={48} />;
      default: return <Video size={48} />;
    }
  };

  const getCameraLabel = (cameraType) => {
    switch (cameraType) {
      case 'frontal': return 'Cámara Frontal';
      case 'interior': return 'Cámara Interior';
      case 'lateral': return 'Cámara Lateral';
      case 'dashboard': return 'Cámara Dashboard';
      default: return 'Cámara';
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'active': return 'green.400';
      case 'warning': return 'orange.400';
      case 'critical': return 'red.400';
      default: return 'gray.300';
    }
  };

  return (
    <Box
      ref={drop}
      bg="gray.700"
      borderRadius="lg"
      border="2px"
      borderColor={isOver ? 'blue.400' : panel.bus ? getStatusBorderColor(panel.bus.status) : 'gray.300'}
      h="full"
      position="relative"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ borderColor: isOver ? 'blue.400' : 'gray.400' }}
    >
      {/* Header */}
      {panel.bus && (
        <HStack
          position="absolute"
          top={3}
          left={3}
          right={3}
          justify="space-between"
          zIndex={2}
        >
          <HStack>
            <Badge
              bg="gray.800"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
            >
              {getCameraLabel(panel.camera)}
            </Badge>
            <Badge
              bg="green.500"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
            >
              VIVO
            </Badge>
          </HStack>
          <IconButton
            icon={<X size={16} />}
            size="sm"
            bg="gray.800"
            color="white"
            _hover={{ bg: 'red.500' }}
            onClick={() => onClose(panel.id)}
          />
        </HStack>
      )}

      {/* Content */}
      <Center h="full" color="gray.400">
        {panel.bus ? (
          <VStack spacing={4}>
            {getCameraIcon(panel.camera)}
            <VStack spacing={1}>
              <Text fontSize="sm" color="white" fontWeight="medium">
                {panel.bus.id}
              </Text>
              <Text fontSize="xs" color="gray.300">
                {panel.bus.driver}
              </Text>
            </VStack>
          </VStack>
        ) : (
          <VStack spacing={4}>
            <Video size={48} />
            <Text fontSize="sm" color="gray.400">
              Arrastra un bus aquí
            </Text>
          </VStack>
        )}
      </Center>

      {/* Controls */}
      {panel.bus && (
        <HStack
          position="absolute"
          bottom={3}
          left={3}
          right={3}
          justify="center"
          spacing={2}
        >
          <IconButton
            icon={<Circle size={16} />}
            size="sm"
            bg="gray.800"
            color="white"
            _hover={{ bg: 'red.500' }}
            title="Grabar"
          />
          <IconButton
            icon={<Camera size={16} />}
            size="sm"
            bg="gray.800"
            color="white"
            _hover={{ bg: 'blue.500' }}
            title="Capturar"
          />
          <IconButton
            icon={<ZoomIn size={16} />}
            size="sm"
            bg="gray.800"
            color="white"
            _hover={{ bg: 'green.500' }}
            title="Zoom"
          />
          <IconButton
            icon={<Square size={16} />}
            size="sm"
            bg="gray.800"
            color="white"
            _hover={{ bg: 'purple.500' }}
            title="Pantalla completa"
          />
        </HStack>
      )}

      {/* Drop Overlay */}
      {isOver && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blue.500"
          opacity={0.2}
          zIndex={1}
        />
      )}
    </Box>
  );
};

export default VideoPanel;