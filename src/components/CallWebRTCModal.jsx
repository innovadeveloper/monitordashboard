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
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  PhoneCall,
  User
} from 'lucide-react';

// Animaciones keyframes
const pulseRing = keyframes`
  0% {
    transform: scale(0.33);
  }
  40%, 50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    transform: scale(1.33);
  }
`;

const pulseDot = keyframes`
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
`;

const CallWebRTCModal = ({ isOpen, onClose, bus, onCallEnd }) => {
  const [callStatus, setCallStatus] = useState('dialing'); // 'dialing', 'connecting', 'connected', 'ended', 'failed'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good'); // 'poor', 'fair', 'good', 'excellent'
  
  const callStartTime = useRef(null);
  const durationInterval = useRef(null);
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('white', '#1a1d29');
  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.800');
  const cardBg = useColorModeValue('white', '#2f3441');
  const textColor = useColorModeValue('gray.800', '#e2e8f0');
  const secondaryTextColor = useColorModeValue('gray.600', '#a0aec0');
  const accentBg = useColorModeValue('blue.50', 'primary.900');
  const accentBorder = useColorModeValue('blue.200', 'primary.700');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleEndCall();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Call simulation logic
  useEffect(() => {
    if (isOpen && callStatus === 'dialing') {
      // Simulate call progression
      const dialingTimer = setTimeout(() => {
        setCallStatus('connecting');
        
        const connectingTimer = setTimeout(() => {
          // Simulate connection success/failure (90% success rate)
          const connected = Math.random() > 0.1;
          
          if (connected) {
            setCallStatus('connected');
            callStartTime.current = Date.now();
            
            // Start duration counter
            durationInterval.current = setInterval(() => {
              if (callStartTime.current) {
                const duration = Math.floor((Date.now() - callStartTime.current) / 1000);
                setCallDuration(duration);
              }
            }, 1000);
            
            // Simulate varying connection quality
            const qualityTimer = setInterval(() => {
              const qualities = ['excellent', 'good', 'fair'];
              const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
              setConnectionQuality(randomQuality);
            }, 5000);
            
            toast({
              title: 'Llamada conectada',
              description: `Conectado con ${bus.conductor}`,
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            
            return () => clearInterval(qualityTimer);
          } else {
            setCallStatus('failed');
            toast({
              title: 'Llamada fallida',
              description: 'No se pudo conectar con el conductor',
              status: 'error',
              duration: 4000,
              isClosable: true,
            });
          }
        }, 2000);
        
        return () => clearTimeout(connectingTimer);
      }, 1500);
      
      return () => clearTimeout(dialingTimer);
    }
  }, [isOpen, callStatus, bus, toast]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      setCallStatus('dialing');
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(false);
      callStartTime.current = null;
      
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    }
  }, [isOpen]);

  const handleEndCall = () => {
    setCallStatus('ended');
    
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    
    if (onCallEnd) {
      onCallEnd(bus, callDuration);
    }
    
    toast({
      title: 'Llamada finalizada',
      description: `Duración: ${formatDuration(callDuration)}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? 'Micrófono activado' : 'Micrófono silenciado',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? 'Altavoz desactivado' : 'Altavoz activado',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'dialing':
        return 'Marcando...';
      case 'connecting':
        return 'Conectando...';
      case 'connected':
        return 'Llamada en curso';
      case 'ended':
        return 'Llamada finalizada';
      case 'failed':
        return 'Llamada fallida';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'dialing':
      case 'connecting':
        return 'blue';
      case 'connected':
        return 'green';
      case 'ended':
        return 'gray';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent':
        return 'green.500';
      case 'good':
        return 'blue.500';
      case 'fair':
        return 'orange.500';
      case 'poor':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={callStatus === 'connected' ? handleEndCall : onClose}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay bg={overlayBg} />
      <ModalContent
        bg={bgColor}
        borderRadius="20px"
        minW="400px"
        maxW="450px"
        boxShadow="2xl"
        mx={4}
      >
        <VStack spacing={6} p={8}>
          {/* Header with Bus Info */}
          <Box textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={1}>
              {bus?.id}
            </Text>
            <Text fontSize="sm" color={secondaryTextColor}>
              {bus?.ruta}
            </Text>
          </Box>

          {/* Driver Avatar and Name */}
          <VStack spacing={4}>
            <Box position="relative">
              <Avatar
                size="2xl"
                name={bus?.conductor}
                bg={useColorModeValue('blue.500', 'primary.600')}
                color="white"
                icon={<User size={40} />}
              />
              
              {/* Animated call rings */}
              {(callStatus === 'dialing' || callStatus === 'connecting') && (
                <>
                  <Circle
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    size="120px"
                    border="3px solid"
                    borderColor={useColorModeValue('blue.400', 'primary.400')}
                    borderRadius="full"
                    animation={`${pulseRing} 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`}
                    opacity={0.4}
                  />
                  <Circle
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    size="140px"
                    border="3px solid"
                    borderColor={useColorModeValue('blue.400', 'primary.400')}
                    borderRadius="full"
                    animation={`${pulseRing} 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.2s infinite`}
                    opacity={0.3}
                  />
                  <Circle
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    size="160px"
                    border="3px solid"
                    borderColor={useColorModeValue('blue.400', 'primary.400')}
                    borderRadius="full"
                    animation={`${pulseRing} 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s infinite`}
                    opacity={0.2}
                  />
                </>
              )}
              
              {/* Connection quality indicator */}
              {callStatus === 'connected' && (
                <Box
                  position="absolute"
                  bottom="0"
                  right="0"
                  bg={cardBg}
                  borderRadius="full"
                  p={2}
                  border="2px solid"
                  borderColor={bgColor}
                >
                  <Circle
                    size="12px"
                    bg={getConnectionQualityColor()}
                    animation={connectionQuality === 'poor' ? `${pulseDot} 1s infinite` : 'none'}
                  />
                </Box>
              )}
            </Box>

            <VStack spacing={2} textAlign="center">
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                {bus?.conductor}
              </Text>
              <Badge colorScheme={getStatusColor()} fontSize="sm" px={3} py={1} borderRadius="full">
                {getStatusText()}
              </Badge>
              
              {callStatus === 'connected' && (
                <Text fontSize="lg" fontWeight="mono" color={useColorModeValue('blue.600', 'primary.300')}>
                  {formatDuration(callDuration)}
                </Text>
              )}
            </VStack>
          </VStack>

          {/* Call Info Card */}
          <Box 
            w="100%" 
            p={4} 
            bg={accentBg}
            borderRadius="lg"
            border="1px solid"
            borderColor={accentBorder}
          >
            <VStack spacing={2}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="xs" color={secondaryTextColor}>Teléfono:</Text>
                <Text fontSize="xs" fontWeight="600" color={textColor}>{bus?.telefono}</Text>
              </HStack>
              <HStack justify="space-between" w="100%">
                <Text fontSize="xs" color={secondaryTextColor}>Estado:</Text>
                <Badge 
                  colorScheme={bus?.estado === 'active' ? 'green' : bus?.estado === 'warning' ? 'orange' : 'red'}
                  fontSize="xs"
                >
                  {bus?.estado === 'active' ? 'En Ruta' : bus?.estado === 'warning' ? 'Con Retraso' : 'Fuera de Ruta'}
                </Badge>
              </HStack>
              {callStatus === 'connected' && (
                <HStack justify="space-between" w="100%">
                  <Text fontSize="xs" color={secondaryTextColor}>Calidad:</Text>
                  <HStack spacing={1}>
                    <Circle size="6px" bg={getConnectionQualityColor()} />
                    <Text fontSize="xs" color={textColor} textTransform="capitalize">
                      {connectionQuality === 'excellent' ? 'Excelente' :
                       connectionQuality === 'good' ? 'Buena' :
                       connectionQuality === 'fair' ? 'Regular' : 'Mala'}
                    </Text>
                  </HStack>
                </HStack>
              )}
            </VStack>
          </Box>

          {/* Call Controls */}
          <HStack spacing={4}>
            {callStatus === 'connected' && (
              <>
                <Button
                  size="lg"
                  borderRadius="full"
                  w={14}
                  h={14}
                  bg={isMuted ? 'red.500' : useColorModeValue('gray.100', '#35394a')}
                  color={isMuted ? 'white' : useColorModeValue('gray.700', '#e2e8f0')}
                  _hover={{
                    bg: isMuted ? 'red.600' : useColorModeValue('gray.200', '#3a3f4c'),
                    transform: 'scale(1.05)'
                  }}
                  onClick={toggleMute}
                >
                  <Icon as={isMuted ? MicOff : Mic} boxSize={6} />
                </Button>

                <Button
                  size="lg"
                  borderRadius="full"
                  w={14}
                  h={14}
                  bg={isSpeakerOn ? 'blue.500' : useColorModeValue('gray.100', '#35394a')}
                  color={isSpeakerOn ? 'white' : useColorModeValue('gray.700', '#e2e8f0')}
                  _hover={{
                    bg: isSpeakerOn ? 'blue.600' : useColorModeValue('gray.200', '#3a3f4c'),
                    transform: 'scale(1.05)'
                  }}
                  onClick={toggleSpeaker}
                >
                  <Icon as={isSpeakerOn ? Volume2 : VolumeX} boxSize={6} />
                </Button>
              </>
            )}

            {/* End Call Button */}
            <Button
              size="lg"
              borderRadius="full"
              w={16}
              h={16}
              bg="red.500"
              color="white"
              _hover={{
                bg: 'red.600',
                transform: 'scale(1.05)'
              }}
              _active={{
                transform: 'scale(0.95)'
              }}
              onClick={handleEndCall}
              isDisabled={callStatus === 'ended'}
            >
              <Icon as={PhoneOff} boxSize={8} />
            </Button>
          </HStack>

          {/* WebRTC Status */}
          {callStatus === 'connected' && (
            <Text fontSize="xs" color={secondaryTextColor} textAlign="center">
              🔒 Llamada encriptada WebRTC
            </Text>
          )}
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default CallWebRTCModal;