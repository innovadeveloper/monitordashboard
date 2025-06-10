// src/components/EnhancedCameraPanel.jsx - Versión actualizada
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  Badge,
  IconButton,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { 
  Camera, 
  ZoomIn, 
  Square, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import CloseConfirmationDialog from '../modals/CloseConfirmationDialog';

const EnhancedCameraPanel = ({ 
  panel, 
  onDrop, 
  onClose, 
  onDoubleClick, 
  onContextMenu,
  isPlaying = true,
  isMuted = false,
  onPlayStateChange,
  onMuteStateChange 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const { isOpen: isCloseDialogOpen, onOpen: onCloseDialogOpen, onClose: onCloseDialogClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    onDrop(panel.id);
  };

  const handleContextMenu = (e) => {
    if (panel.status !== 'empty') {
      e.preventDefault();
      onContextMenu(e, panel);
    }
  };

  const handleControlAction = (action) => {
    switch(action) {
      case 'record':
        toast({
          title: 'Grabación iniciada',
          description: `Panel ${panel.id} - ${panel.bus?.id}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        break;
      case 'capture':
        toast({
          title: 'Captura tomada',
          description: `Imagen guardada - ${panel.bus?.id}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        break;
      case 'zoom':
        toast({
          title: 'Zoom activado',
          description: 'Use la rueda del mouse para ajustar',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
        break;
      case 'playPause':
        onPlayStateChange?.(panel.id, !isPlaying);
        break;
      case 'mute':
        onMuteStateChange?.(panel.id, !isMuted);
        break;
      case 'close':
        onCloseDialogOpen();
        break;
      default:
        break;
    }
  };

  const handleConfirmClose = () => {
    onClose(panel.id);
    onCloseDialogClose();
    toast({
      title: 'Cámara cerrada',
      description: `Panel ${panel.id} liberado`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box
        position="relative"
        h="100%"
        minH="200px"
        bg={panel.status === 'empty' ? 'gray.100' : 'gray.700'}
        borderRadius="md"
        border={dragOver ? '3px dashed' : '2px solid'}
        borderColor={dragOver ? 'primary.500' : panel.status === 'empty' ? 'gray.300' : 'gray.600'}
        overflow="hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDoubleClick={() => onDoubleClick?.(panel.id)}
        onContextMenu={handleContextMenu}
        cursor={panel.status === 'empty' ? 'pointer' : 'default'}
        transition="all 0.2s"
        _hover={panel.status === 'empty' ? { borderColor: 'primary.400' } : {}}
      >
        {panel.status === 'empty' ? (
          <Flex
            h="100%"
            align="center"
            justify="center"
            direction="column"
            color="gray.500"
          >
            <Camera size={40} style={{ opacity: 0.5, marginBottom: '8px' }} />
            <Text fontSize="sm">Arrastra un bus aquí</Text>
            <Text fontSize="xs" color="gray.400" mt={1}>
              Click derecho para opciones
            </Text>
          </Flex>
        ) : (
          <>
            {/* Camera Overlay */}
            <Flex
              position="absolute"
              top={3}
              left={3}
              right={3}
              justify="space-between"
              align="center"
              zIndex={10}
            >
              <Text
                bg="blackAlpha.700"
                color="white"
                px={3}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {panel.cameraType?.toUpperCase()}
              </Text>
              <HStack spacing={2}>
                {isPlaying ? (
                  <Badge colorScheme="green" fontSize="9px">
                    VIVO
                  </Badge>
                ) : (
                  <Badge colorScheme="gray" fontSize="9px">
                    PAUSADO
                  </Badge>
                )}
                {isMuted && (
                  <Badge colorScheme="orange" fontSize="9px">
                    SIN AUDIO
                  </Badge>
                )}
              </HStack>
            </Flex>

            {/* Bus Info */}
            <Flex
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              direction="column"
              align="center"
              color="white"
              textAlign="center"
            >
              {isPlaying ? (
                <Camera size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
              ) : (
                <Pause size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
              )}
              <Text fontWeight="600" mb={1}>
                {panel.bus?.id}
              </Text>
              <Text fontSize="sm" opacity={0.8}>
                {panel.bus?.conductor}
              </Text>
            </Flex>

            {/* Camera Controls */}
            <HStack
              position="absolute"
              bottom={3}
              right={3}
              spacing={2}
              zIndex={10}
            >
              {/* Play/Pause Button */}
              <IconButton
                aria-label={isPlaying ? "Pause" : "Play"}
                icon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                size="sm"
                colorScheme={isPlaying ? "orange" : "green"}
                borderRadius="full"
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                onClick={() => handleControlAction('playPause')}
              />
              
              {/* Mute Button */}
              <IconButton
                aria-label={isMuted ? "Unmute" : "Mute"}
                icon={isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                size="sm"
                colorScheme={isMuted ? "orange" : "blue"}
                borderRadius="full"
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                onClick={() => handleControlAction('mute')}
              />

              {/* Record Button */}
              <IconButton
                aria-label="Record"
                icon={<Square size={16} />}
                size="sm"
                colorScheme="red"
                borderRadius="full"
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                onClick={() => handleControlAction('record')}
              />

              {/* Capture Button */}
              <IconButton
                aria-label="Capture"
                icon={<Camera size={16} />}
                size="sm"
                borderRadius="full"
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                onClick={() => handleControlAction('capture')}
              />

              {/* Zoom Button */}
              <IconButton
                aria-label="Zoom"
                icon={<ZoomIn size={16} />}
                size="sm"
                borderRadius="full"
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                onClick={() => handleControlAction('zoom')}
              />

              {/* Close Button */}
              <IconButton
                aria-label="Close"
                icon={<X size={16} />}
                size="sm"
                borderRadius="full"
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                onClick={() => handleControlAction('close')}
              />
            </HStack>
          </>
        )}
      </Box>

      {/* Close Confirmation Dialog */}
      <CloseConfirmationDialog
        isOpen={isCloseDialogOpen}
        onClose={onCloseDialogClose}
        onConfirm={handleConfirmClose}
        panelData={panel}
        cancelRef={cancelRef}
      />
    </>
  );
};

export default EnhancedCameraPanel;