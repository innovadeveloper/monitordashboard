import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Grid,
  Box,
  Text,
  VStack,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { Video, Camera, Car, Monitor } from 'lucide-react';

const cameraTypes = [
  {
    id: 'frontal',
    name: 'Cámara Frontal',
    icon: Video,
    description: 'Vista frontal del vehículo'
  },
  {
    id: 'interior',
    name: 'Cámara Interior',
    icon: Camera,
    description: 'Vista interior del bus'
  },
  {
    id: 'lateral',
    name: 'Cámara Lateral',
    icon: Video,
    description: 'Vista lateral del vehículo'
  },
  {
    id: 'dashboard',
    name: 'Cámara Dashboard',
    icon: Monitor,
    description: 'Vista del tablero'
  },
];

const CameraSelectionModal = ({ isOpen, onClose, bus, onCameraSelect }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent bg={bgColor} borderRadius="xl">
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold">
              Seleccionar Cámara
            </Text>
            {bus && (
              <Text fontSize="sm" color="gray.500">
                {bus.id} - {bus.driver}
              </Text>
            )}
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns="1fr 1fr" gap={4}>
            {cameraTypes.map((camera) => {
              const IconComponent = camera.icon;
              return (
                <Box
                  key={camera.id}
                  p={4}
                  border="2px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: 'blue.400',
                    bg: hoverBg,
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                  onClick={() => onCameraSelect(camera.id)}
                >
                  <Center>
                    <VStack spacing={3}>
                      <Box color="blue.500">
                        <IconComponent size={32} />
                      </Box>
                      <VStack spacing={1}>
                        <Text fontSize="sm" fontWeight="medium" textAlign="center">
                          {camera.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          {camera.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </Center>
                </Box>
              );
            })}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CameraSelectionModal;