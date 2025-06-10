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

// Camera Selection Modal
const CameraSelectionModal = ({ isOpen, onClose, bus, onCameraSelect }) => {
  const cameraOptions = [
    { type: 'frontal', label: 'Cámara Frontal', description: 'Vista frontal del vehículo', icon: '📹' },
    { type: 'interior', label: 'Cámara Interior', description: 'Vista interior del bus', icon: '📷' },
    { type: 'lateral', label: 'Cámara Lateral', description: 'Vista lateral del vehículo', icon: '📹' },
    { type: 'dashboard', label: 'Cámara Dashboard', description: 'Vista del tablero', icon: '🖥️' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={useColorModeValue('white', '#2f3441')} color={useColorModeValue('gray.800', '#e2e8f0')}>
        <ModalHeader color={useColorModeValue('gray.800', '#e2e8f0')}>Seleccionar Cámara</ModalHeader>
        <ModalCloseButton color={useColorModeValue('gray.600', '#a0aec0')} />
        <ModalBody>
          {bus && (
            <VStack spacing={4}>
              <Text fontSize="lg" fontWeight="600" color={useColorModeValue('blue.600', 'primary.300')}>
                {bus.id} - {bus.conductor}
              </Text>

              <Grid templateColumns="1fr 1fr" gap={4} w="100%">
                {cameraOptions.map((camera) => (
                  <Box
                    key={camera.type}
                    p={4}
                    border="2px"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    borderRadius="lg"
                    cursor="pointer"
                    textAlign="center"
                    transition="all 0.2s"
                    bg={useColorModeValue('white', '#2a2f3a')}
                    role="group"
                    _hover={{
                      borderColor: useColorModeValue('blue.500', 'primary.400'),
                      bg: useColorModeValue('blue.50', 'primary.800'),
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                      '& .camera-text': {
                        color: useColorModeValue('gray.800', '#e2e8f0')
                      },
                      '& .camera-desc': {
                        color: useColorModeValue('gray.600', '#a0aec0')
                      }
                    }}
                    onClick={() => onCameraSelect(camera.type)}
                  >
                    <Text fontSize="2xl" mb={2}>{camera.icon}</Text>
                    <Text 
                      className="camera-text"
                      fontWeight="600" 
                      mb={1} 
                      color={useColorModeValue('gray.800', '#e2e8f0')}
                    >
                      {camera.label}
                    </Text>
                    <Text 
                      className="camera-desc"
                      fontSize="xs" 
                      color={useColorModeValue('gray.600', '#a0aec0')}
                    >
                      {camera.description}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="ghost" 
            onClick={onClose}
            color={useColorModeValue('gray.600', '#a0aec0')}
            _hover={{ 
              bg: useColorModeValue('gray.100', '#35394a'),
              color: useColorModeValue('gray.800', '#e2e8f0')
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CameraSelectionModal;