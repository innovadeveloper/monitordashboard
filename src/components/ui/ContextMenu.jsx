// src/components/ContextMenu.jsx
import React, { useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  Button,
  Divider,
  Text,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  Play, 
  Pause, 
  X, 
  Camera, 
  ZoomIn, 
  Maximize2, 
  Volume2, 
  VolumeX,
  Settings 
} from 'lucide-react';

const ContextMenu = ({ 
  isOpen, 
  position, 
  onClose, 
  panelData,
  onPlay, 
  onPause, 
  onClose: onClosePanel, 
  onCapture,
  onZoom,
  onFullscreen,
  onMute,
  onUnmute,
  onSettings,
  isPlaying = true,
  isMuted = false 
}) => {
  const menuRef = useRef();
  const bgColor = useColorModeValue('white', '#2f3441');
  const borderColor = useColorModeValue('gray.200', 'transparent');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  const menuItems = [
    {
      id: 'playPause',
      label: isPlaying ? 'Pausar Video' : 'Reproducir Video',
      icon: isPlaying ? <Pause size={16} /> : <Play size={16} />,
      action: isPlaying ? onPause : onPlay,
      color: isPlaying ? 'orange.500' : 'green.500'
    },
    {
      id: 'capture',
      label: 'Tomar Captura',
      icon: <Camera size={16} />,
      action: onCapture,
      color: 'blue.500'
    },
    {
      id: 'zoom',
      label: 'Zoom Digital',
      icon: <ZoomIn size={16} />,
      action: onZoom,
      color: 'purple.500'
    },
    {
      id: 'fullscreen',
      label: 'Pantalla Completa',
      icon: <Maximize2 size={16} />,
      action: onFullscreen,
      color: 'gray.600'
    },
    {
      id: 'divider1',
      type: 'divider'
    },
    {
      id: 'mute',
      label: isMuted ? 'Activar Audio' : 'Silenciar Audio',
      icon: isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />,
      action: isMuted ? onUnmute : onMute,
      color: isMuted ? 'green.500' : 'orange.500'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <Settings size={16} />,
      action: onSettings,
      color: 'gray.600'
    },
    {
      id: 'divider2',
      type: 'divider'
    },
    {
      id: 'close',
      label: 'Cerrar Panel',
      icon: <X size={16} />,
      action: onClosePanel,
      color: 'red.500',
      variant: 'danger'
    }
  ];

  return (
    <Box
      ref={menuRef}
      position="fixed"
      top={`${position.y}px`}
      left={`${position.x}px`}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="12px"
      boxShadow="0 10px 25px rgba(0,0,0,0.15)"
      p={2}
      zIndex={1000}
      minW="200px"
      maxW="250px"
    >
      {/* Header with panel info */}
      {panelData && (
        <>
          <Box p={2} mb={2}>
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue('gray.700', '#e2e8f0')}>
              {panelData.bus?.id} - {panelData.cameraType?.toUpperCase()}
            </Text>
            <Text fontSize="xs" color={useColorModeValue('gray.500', '#a0aec0')}>
              {panelData.bus?.conductor}
            </Text>
          </Box>
          <Divider mb={2} />
        </>
      )}

      <VStack spacing={1} align="stretch">
        {menuItems.map((item) => {
          if (item.type === 'divider') {
            return <Divider key={item.id} my={1} />;
          }

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              justifyContent="flex-start"
              leftIcon={item.icon}
              onClick={() => {
                item.action?.();
                onClose();
              }}
              borderRadius="8px"
              color={item.variant === 'danger' ? 'red.500' : useColorModeValue('gray.700', '#e2e8f0')}
              _hover={{ 
                bg: item.variant === 'danger' 
                  ? useColorModeValue('red.50', 'red.900')
                  : useColorModeValue('gray.50', '#35394a'),
                color: item.variant === 'danger' ? 'red.600' : item.color
              }}
              _active={{
                bg: item.variant === 'danger' 
                  ? useColorModeValue('red.100', 'red.800')
                  : useColorModeValue('gray.100', '#3a3f4c')
              }}
              transition="all 0.2s"
            >
              <HStack spacing={3} w="100%" justify="flex-start">
                {/* <Box color={item.color}>
                  {item.icon}
                </Box> */}
                <Text fontSize="sm" color={useColorModeValue('gray.700', '#e2e8f0')}>{item.label}</Text>
              </HStack>
            </Button>
          );
        })}
      </VStack>
    </Box>
  );
};

export default ContextMenu;