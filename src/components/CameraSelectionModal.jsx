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
      <ModalContent>
        <ModalHeader>Seleccionar Cámara</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {bus && (
            <VStack spacing={4}>
              <Text fontSize="lg" fontWeight="600" color="blue.600">
                {bus.id} - {bus.conductor}
              </Text>

              <Grid templateColumns="1fr 1fr" gap={4} w="100%">
                {cameraOptions.map((camera) => (
                  <Box
                    key={camera.type}
                    p={4}
                    border="2px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    cursor="pointer"
                    textAlign="center"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'blue.500',
                      bg: 'blue.50'
                    }}
                    onClick={() => onCameraSelect(camera.type)}
                  >
                    <Text fontSize="2xl" mb={2}>{camera.icon}</Text>
                    <Text fontWeight="600" mb={1}>{camera.label}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {camera.description}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CameraSelectionModal;