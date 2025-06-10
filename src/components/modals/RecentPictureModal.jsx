import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { ArrowLeft, ArrowRight, Download, Calendar, MapPin, User } from 'lucide-react';

const RecentPictureModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  bus, 
  photoIndex, 
  totalPhotos, 
  onPrevious, 
  onNext 
}) => {
  // Color mode values
  const bgColor = useColorModeValue('white', '#1a1d29');
  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.800');
  const textColor = useColorModeValue('gray.800', '#e2e8f0');
  const secondaryTextColor = useColorModeValue('gray.600', '#a0aec0');
  const cardBg = useColorModeValue('gray.50', '#2f3441');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === 'ArrowLeft' && isOpen && onPrevious) {
        onPrevious();
      }
      if (e.key === 'ArrowRight' && isOpen && onNext) {
        onNext();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, onPrevious, onNext]);

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `foto_${bus?.id}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      isCentered
      size="6xl"
      closeOnOverlayClick={true}
      closeOnEsc={true}
    >
      <ModalOverlay bg={overlayBg} />
      <ModalContent
        bg={bgColor}
        borderRadius="xl"
        maxW="90vw"
        maxH="90vh"
        boxShadow="2xl"
        mx={4}
        overflow="hidden"
      >
        <ModalCloseButton 
          size="lg"
          color={textColor}
          _hover={{ 
            bg: useColorModeValue('gray.100', '#35394a') 
          }}
          zIndex={10}
        />

        <Box position="relative" h="100%">
          {/* Main Image Container */}
          <Box 
            position="relative" 
            h="70vh" 
            bg={cardBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Foto reciente de ${bus?.id}`}
                maxW="100%"
                maxH="100%"
                objectFit="contain"
                borderRadius="md"
                boxShadow="lg"
              />
            ) : (
              <VStack spacing={4} color={secondaryTextColor}>
                <Box fontSize="4xl">📷</Box>
                <Text>Imagen no disponible</Text>
              </VStack>
            )}

            {/* Navigation Arrows */}
            {totalPhotos > 1 && (
              <>
                <IconButton
                  icon={<ArrowLeft size={24} />}
                  position="absolute"
                  left="4"
                  top="50%"
                  transform="translateY(-50%)"
                  size="lg"
                  bg={useColorModeValue('white', '#2f3441')}
                  color={useColorModeValue('gray.700', '#e2e8f0')}
                  opacity="0.9"
                  _hover={{ 
                    opacity: 1, 
                    bg: useColorModeValue('gray.50', '#35394a'),
                    transform: 'translateY(-50%) scale(1.05)'
                  }}
                  onClick={onPrevious}
                  aria-label="Foto anterior"
                  boxShadow="md"
                  isDisabled={!onPrevious}
                />
                <IconButton
                  icon={<ArrowRight size={24} />}
                  position="absolute"
                  right="4"
                  top="50%"
                  transform="translateY(-50%)"
                  size="lg"
                  bg={useColorModeValue('white', '#2f3441')}
                  color={useColorModeValue('gray.700', '#e2e8f0')}
                  opacity="0.9"
                  _hover={{ 
                    opacity: 1, 
                    bg: useColorModeValue('gray.50', '#35394a'),
                    transform: 'translateY(-50%) scale(1.05)'
                  }}
                  onClick={onNext}
                  aria-label="Foto siguiente"
                  boxShadow="md"
                  isDisabled={!onNext}
                />
              </>
            )}

            {/* Photo Counter */}
            {totalPhotos > 1 && (
              <Box
                position="absolute"
                top="4"
                right="16"
                bg={useColorModeValue('white', '#2f3441')}
                px={3}
                py={1}
                borderRadius="full"
                boxShadow="md"
                opacity="0.9"
              >
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  {photoIndex + 1} de {totalPhotos}
                </Text>
              </Box>
            )}
          </Box>

          {/* Info Panel */}
          <Box 
            p={6} 
            bg={bgColor}
            borderTop="1px solid"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <VStack spacing={2} align="start">
                <HStack spacing={3}>
                  <Box 
                    w={10} 
                    h={10} 
                    bg={useColorModeValue('blue.500', 'primary.600')}
                    color="white"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <User size={20} />
                  </Box>
                  <VStack spacing={0} align="start">
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {bus?.id}
                    </Text>
                    <Text fontSize="sm" color={secondaryTextColor}>
                      {bus?.conductor}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>

              <IconButton
                icon={<Download size={20} />}
                colorScheme="blue"
                size="lg"
                onClick={handleDownload}
                aria-label="Descargar foto"
                isDisabled={!imageUrl}
              />
            </Flex>

            <Flex wrap="wrap" gap={4} justify="space-between">
              <VStack spacing={2} align="start">
                <HStack spacing={2}>
                  <MapPin size={16} color={secondaryTextColor} />
                  <Text fontSize="sm" color={textColor}>
                    <Text as="span" fontWeight="medium">Ruta:</Text> {bus?.ruta}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Calendar size={16} color={secondaryTextColor} />
                  <Text fontSize="sm" color={textColor}>
                    <Text as="span" fontWeight="medium">Fecha:</Text> {formatDate(new Date())}
                  </Text>
                </HStack>
              </VStack>

              <VStack spacing={2} align="start">
                <HStack spacing={2}>
                  <Text fontSize="sm" color={textColor}>
                    <Text as="span" fontWeight="medium">Estado:</Text>
                  </Text>
                  <Badge 
                    colorScheme={
                      bus?.estado === 'active' ? 'green' : 
                      bus?.estado === 'warning' ? 'orange' : 'red'
                    }
                    fontSize="xs"
                  >
                    {bus?.estado === 'active' ? 'En Ruta' : 
                     bus?.estado === 'warning' ? 'Con Retraso' : 'Fuera de Ruta'}
                  </Badge>
                </HStack>
                <HStack spacing={2}>
                  <Text fontSize="sm" color={textColor}>
                    <Text as="span" fontWeight="medium">Velocidad:</Text> {bus?.velocidad}
                  </Text>
                </HStack>
              </VStack>
            </Flex>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default RecentPictureModal;