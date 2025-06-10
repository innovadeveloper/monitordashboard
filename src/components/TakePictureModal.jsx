import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  useColorModeValue,
  useToast,
  Flex,
  Icon,
  Avatar,
  Circle,
  Grid,
  GridItem,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { 
  Camera, 
  X, 
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  MapPin,
  User
} from 'lucide-react';

// Import camera configuration
import { getCamerasForVehicle, getCameraSettings } from '../config/cameras';

// Animaciones keyframes
const pulseCamera = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const captureFlash = keyframes`
  0% {
    opacity: 0;
    background: white;
  }
  10% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
  }
`;

const TakePictureModal = ({ isOpen, onClose, bus, onPictureTaken }) => {
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [captureStatus, setCaptureStatus] = useState('idle'); // 'idle', 'capturing', 'completed', 'failed'
  const [captureProgress, setCaptureProgress] = useState(0);
  const [capturedImages, setCapturedImages] = useState([]);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [showFlash, setShowFlash] = useState(false);
  
  const settings = getCameraSettings();
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('white', '#1a1d29');
  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.800');
  const cardBg = useColorModeValue('white', '#2f3441');
  const textColor = useColorModeValue('gray.800', '#e2e8f0');
  const secondaryTextColor = useColorModeValue('gray.600', '#a0aec0');
  const accentBg = useColorModeValue('blue.50', 'primary.900');
  const accentBorder = useColorModeValue('blue.200', 'primary.700');
  const selectedBg = useColorModeValue('blue.100', 'primary.800');
  const selectedBorder = useColorModeValue('blue.400', 'primary.500');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && captureStatus !== 'capturing') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, captureStatus, onClose]);

  // Initialize cameras when modal opens
  useEffect(() => {
    if (isOpen && bus) {
      // Get cameras based on vehicle type or use default
      const vehicleType = bus.tipo || 'bus_standard';
      const cameras = getCamerasForVehicle(vehicleType);
      setAvailableCameras(cameras);
      
      // Start with no cameras selected
      setSelectedCameras([]);
    }
  }, [isOpen, bus]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCameras([]);
      setCaptureStatus('idle');
      setCaptureProgress(0);
      setCapturedImages([]);
      setShowFlash(false);
    }
  }, [isOpen]);

  const toggleCameraSelection = (cameraId) => {
    if (captureStatus === 'capturing') return;
    
    setSelectedCameras(prev => {
      if (prev.includes(cameraId)) {
        return prev.filter(id => id !== cameraId);
      } else {
        return [...prev, cameraId];
      }
    });
  };

  const handleCapturePictures = async () => {
    if (selectedCameras.length === 0) {
      toast({
        title: 'Selecciona cámaras',
        description: 'Debes seleccionar al menos una cámara para tomar fotos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCaptureStatus('capturing');
    setCaptureProgress(0);
    setCapturedImages([]);
    
    try {
      const totalCameras = selectedCameras.length;
      const capturedResults = [];

      for (let i = 0; i < selectedCameras.length; i++) {
        const cameraId = selectedCameras[i];
        const camera = availableCameras.find(c => c.id === cameraId);
        
        // Show flash effect
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
        
        // Simulate capture delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Simulate capture success/failure (95% success rate)
        const success = Math.random() > 0.05;
        
        const result = {
          cameraId,
          cameraName: camera.name,
          timestamp: new Date().toISOString(),
          success,
          imageUrl: success ? `https://picsum.photos/400/300?random=${Date.now()}&camera=${cameraId}` : null,
          error: success ? null : 'Error de conexión con la cámara',
          metadata: {
            busId: bus.id,
            location: `${bus.ruta}`,
            quality: camera.quality,
            hasGPS: settings.enableGPS,
            hasTimestamp: settings.enableTimestamp
          }
        };
        
        capturedResults.push(result);
        setCapturedImages(prev => [...prev, result]);
        
        // Update progress
        const progress = ((i + 1) / totalCameras) * 100;
        setCaptureProgress(progress);
      }
      
      setCaptureStatus('completed');
      
      const successCount = capturedResults.filter(r => r.success).length;
      const failureCount = capturedResults.filter(r => !r.success).length;
      
      toast({
        title: 'Captura completada',
        description: `${successCount} fotos capturadas exitosamente${failureCount > 0 ? `, ${failureCount} fallaron` : ''}`,
        status: successCount > 0 ? 'success' : 'error',
        duration: 4000,
        isClosable: true,
      });
      
      // Call parent callback
      if (onPictureTaken) {
        onPictureTaken(bus, capturedResults);
      }
      
    } catch (error) {
      setCaptureStatus('failed');
      toast({
        title: 'Error de captura',
        description: 'Ocurrió un error durante la captura de imágenes',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDownloadAll = () => {
    const successfulCaptures = capturedImages.filter(img => img.success);
    
    if (successfulCaptures.length === 0) {
      toast({
        title: 'Sin imágenes',
        description: 'No hay imágenes exitosas para descargar',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: 'Descargando imágenes',
      description: `Iniciando descarga de ${successfulCaptures.length} imágenes`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const getStatusIcon = () => {
    switch (captureStatus) {
      case 'capturing':
        return <Clock size={20} />;
      case 'completed':
        return <CheckCircle size={20} />;
      case 'failed':
        return <AlertCircle size={20} />;
      default:
        return <Camera size={20} />;
    }
  };

  const getStatusText = () => {
    switch (captureStatus) {
      case 'capturing':
        return 'Capturando imágenes...';
      case 'completed':
        return 'Captura completada';
      case 'failed':
        return 'Error en captura';
      default:
        return 'Listo para capturar';
    }
  };

  const getStatusColor = () => {
    switch (captureStatus) {
      case 'capturing':
        return 'blue';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={captureStatus === 'capturing' ? undefined : onClose}
      isCentered
      closeOnOverlayClick={captureStatus !== 'capturing'}
      closeOnEsc={captureStatus !== 'capturing'}
      size="lg"
    >
      <ModalOverlay bg={overlayBg} />
      <ModalContent
        bg={bgColor}
        borderRadius="20px"
        minW="500px"
        maxW="600px"
        boxShadow="2xl"
        mx={4}
        position="relative"
        overflow="hidden"
      >
        {/* Flash effect overlay */}
        {showFlash && (
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="white"
            zIndex={999}
            animation={`${captureFlash} 0.2s ease-out`}
            pointerEvents="none"
          />
        )}

        <VStack spacing={6} p={8}>
          {/* Header with Bus Info */}
          <Box textAlign="center">
            <HStack justify="center" spacing={3} mb={2}>
              <Avatar
                size="md"
                name={bus?.conductor}
                bg={useColorModeValue('blue.500', 'primary.600')}
                color="white"
                icon={<User size={20} />}
              />
              <VStack spacing={0} align="start">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {bus?.id}
                </Text>
                <Text fontSize="sm" color={secondaryTextColor}>
                  {bus?.conductor}
                </Text>
              </VStack>
            </HStack>
            <Text fontSize="sm" color={secondaryTextColor}>
              {bus?.ruta}
            </Text>
          </Box>

          {/* Status Badge */}
          <HStack spacing={2}>
            {getStatusIcon()}
            <Badge 
              colorScheme={getStatusColor()} 
              fontSize="sm" 
              px={3} 
              py={1} 
              borderRadius="full"
              animation={captureStatus === 'capturing' ? `${pulseCamera} 1.5s infinite` : 'none'}
            >
              {getStatusText()}
            </Badge>
          </HStack>

          {/* Progress Bar (during capture) */}
          {captureStatus === 'capturing' && (
            <Box w="100%">
              <Progress 
                value={captureProgress} 
                colorScheme="blue" 
                borderRadius="full" 
                size="sm"
                bg={useColorModeValue('gray.200', '#35394a')}
              />
              <Text fontSize="xs" color={secondaryTextColor} textAlign="center" mt={1}>
                {Math.round(captureProgress)}% completado
              </Text>
            </Box>
          )}

          {/* Camera Selection Grid */}
          <Box w="100%">
            <Text fontSize="md" fontWeight="600" mb={3} color={textColor}>
              Seleccionar cámaras ({selectedCameras.length} seleccionadas)
            </Text>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              {availableCameras.map((camera) => {
                const isSelected = selectedCameras.includes(camera.id);
                const isDisabled = captureStatus === 'capturing';
                
                return (
                  <GridItem key={camera.id}>
                    <Box
                      p={4}
                      bg={isSelected ? selectedBg : cardBg}
                      border="2px solid"
                      borderColor={isSelected ? selectedBorder : useColorModeValue('gray.200', 'gray.600')}
                      borderRadius="lg"
                      cursor={isDisabled ? 'not-allowed' : 'pointer'}
                      opacity={isDisabled ? 0.6 : 1}
                      transition="all 0.2s"
                      _hover={{
                        transform: isDisabled ? 'none' : 'translateY(-2px)',
                        boxShadow: isDisabled ? 'none' : 'md'
                      }}
                      onClick={() => !isDisabled && toggleCameraSelection(camera.id)}
                    >
                      <VStack spacing={2}>
                        <Text fontSize="2xl">{camera.icon}</Text>
                        <Text fontSize="sm" fontWeight="600" color={textColor} textAlign="center">
                          {camera.name}
                        </Text>
                        <Text fontSize="xs" color={secondaryTextColor} textAlign="center">
                          {camera.description}
                        </Text>
                        <HStack spacing={1}>
                          <Badge size="xs" colorScheme="purple">{camera.quality}</Badge>
                          {camera.hasNightVision && <Badge size="xs" colorScheme="orange">🌙</Badge>}
                          {camera.hasAudio && <Badge size="xs" colorScheme="green">🔊</Badge>}
                        </HStack>
                      </VStack>
                    </Box>
                  </GridItem>
                );
              })}
            </Grid>
          </Box>

          {/* Capture Results */}
          {capturedImages.length > 0 && (
            <Box w="100%">
              <Divider my={2} />
              <Text fontSize="md" fontWeight="600" mb={3} color={textColor}>
                Resultados de captura
              </Text>
              
              <VStack spacing={2} maxH="150px" overflowY="auto">
                {capturedImages.map((result, index) => (
                  <HStack key={index} w="100%" justify="space-between" p={2} bg={cardBg} borderRadius="md">
                    <HStack spacing={2}>
                      <Icon 
                        as={result.success ? CheckCircle : AlertCircle} 
                        color={result.success ? 'green.500' : 'red.500'} 
                        size={16}
                      />
                      <Text fontSize="sm" color={textColor}>{result.cameraName}</Text>
                    </HStack>
                    <Text fontSize="xs" color={secondaryTextColor}>
                      {result.success ? '✓ Exitosa' : '✗ Error'}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}

          {/* Action Buttons */}
          <HStack spacing={4} w="100%">
            <Button
              flex={1}
              variant="ghost"
              onClick={onClose}
              isDisabled={captureStatus === 'capturing'}
              color={secondaryTextColor}
              _hover={{ 
                bg: useColorModeValue('gray.100', '#35394a'),
                color: textColor
              }}
            >
              {captureStatus === 'completed' ? 'Cerrar' : 'Cancelar'}
            </Button>

            {captureStatus === 'completed' && capturedImages.some(img => img.success) && (
              <Button
                leftIcon={<Download size={16} />}
                colorScheme="green"
                onClick={handleDownloadAll}
              >
                Descargar
              </Button>
            )}

            <Button
              flex={1}
              leftIcon={<Camera size={16} />}
              colorScheme="blue"
              onClick={handleCapturePictures}
              isLoading={captureStatus === 'capturing'}
              loadingText="Capturando..."
              isDisabled={selectedCameras.length === 0 || captureStatus === 'capturing'}
            >
              {captureStatus === 'idle' ? 'Tomar Fotos' : 'Capturar Nuevamente'}
            </Button>
          </HStack>

          {/* Settings Info */}
          <Box 
            w="100%" 
            p={3} 
            bg={accentBg}
            borderRadius="lg"
            border="1px solid"
            borderColor={accentBorder}
          >
            <Text fontSize="xs" color={secondaryTextColor} textAlign="center">
              📸 Formato: {settings.defaultImageFormat} • Calidad: {settings.defaultQuality}% • 
              {settings.enableGPS && ' 📍 GPS'} {settings.enableTimestamp && ' 🕐 Timestamp'}
            </Text>
          </Box>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default TakePictureModal;