import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Textarea,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  useColorModeValue,
  useToast,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Send, MessageCircle, Check, CheckCheck, AlertCircle, GripHorizontal } from 'lucide-react';

const MensajeTTSModal = ({ isOpen, onClose, bus, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('pending'); // 'pending', 'sent', 'delivered', 'failed'
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const modalRef = useRef();
  const headerRef = useRef();
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('white', '#2f3441');
  const headerBg = useColorModeValue('blue.500', 'primary.600');
  const textColor = useColorModeValue('gray.800', '#e2e8f0');
  const secondaryTextColor = useColorModeValue('gray.600', '#a0aec0');
  const inputBg = useColorModeValue('white', '#35394a');
  const inputBorder = useColorModeValue('gray.200', 'transparent');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setDeliveryStatus('pending');
      setDragPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Drag functionality
  const handleMouseDown = (e) => {
    if (headerRef.current && headerRef.current.contains(e.target)) {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - 400; // modal width
      const maxY = window.innerHeight - 300; // modal height
      
      setDragPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: 'Mensaje requerido',
        description: 'Por favor ingresa un mensaje para enviar',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setDeliveryStatus('sent');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate delivery status
      const delivered = Math.random() > 0.2; // 80% success rate
      
      if (delivered) {
        setDeliveryStatus('delivered');
        toast({
          title: 'Mensaje enviado',
          description: `Mensaje TTS enviado exitosamente a ${bus.id}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Call parent callback
        if (onSendMessage) {
          onSendMessage(bus, message);
        }
        
        // Auto close after success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setDeliveryStatus('failed');
        toast({
          title: 'Error de envío',
          description: 'No se pudo enviar el mensaje. Intenta nuevamente.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      setDeliveryStatus('failed');
      toast({
        title: 'Error de conexión',
        description: 'Error de conexión con el servidor',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDeliveryIcon = () => {
    switch (deliveryStatus) {
      case 'sent':
        return <Check size={16} color="#4299e1" />;
      case 'delivered':
        return <CheckCheck size={16} color="#48bb78" />;
      case 'failed':
        return <AlertCircle size={16} color="#f56565" />;
      default:
        return null;
    }
  };

  const getDeliveryText = () => {
    switch (deliveryStatus) {
      case 'sent':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'failed':
        return 'Error de envío';
      default:
        return '';
    }
  };

  const getDeliveryColor = () => {
    switch (deliveryStatus) {
      case 'sent':
        return 'blue';
      case 'delivered':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const quickMessages = [
    "Reduce la velocidad por favor",
    "Mantén la ruta asignada",
    "Reporta tu ubicación actual",
    "Regresa a la estación",
    "Conduce con precaución"
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered={!isDragging}
      closeOnOverlayClick={!isDragging}
    >
      <ModalOverlay />
      <ModalContent
        ref={modalRef}
        bg={bgColor}
        borderRadius="12px"
        minW="400px"
        maxW="500px"
        position={isDragging ? "fixed" : "relative"}
        left={isDragging ? `${dragPosition.x}px` : "auto"}
        top={isDragging ? `${dragPosition.y}px` : "auto"}
        transform={isDragging ? "none" : "auto"}
        cursor={isDragging ? "grabbing" : "default"}
        boxShadow="xl"
      >
        {/* Draggable Header */}
        <ModalHeader
          ref={headerRef}
          bg={headerBg}
          color="white"
          borderTopRadius="12px"
          cursor="grab"
          onMouseDown={handleMouseDown}
          _active={{ cursor: "grabbing" }}
          position="relative"
        >
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <MessageCircle size={20} />
              <VStack spacing={0} align="start">
                <Text fontSize="lg" fontWeight="bold">
                  Mensaje TTS
                </Text>
                <Text fontSize="sm" opacity={0.9}>
                  {bus?.id} - {bus?.conductor}
                </Text>
              </VStack>
            </HStack>
            
            <HStack spacing={2}>
              {deliveryStatus !== 'pending' && (
                <HStack spacing={1}>
                  {getDeliveryIcon()}
                  <Text fontSize="xs" color="white">
                    {getDeliveryText()}
                  </Text>
                </HStack>
              )}
              <Icon as={GripHorizontal} opacity={0.7} />
            </HStack>
          </HStack>
        </ModalHeader>

        <ModalCloseButton color="white" />

        <ModalBody p={6}>
          <VStack spacing={4} align="stretch">
            {/* Bus Info */}
            <Box 
              p={3} 
              bg={useColorModeValue('blue.50', 'primary.900')} 
              borderRadius="lg"
              border="1px solid"
              borderColor={useColorModeValue('blue.200', 'primary.700')}
            >
              <HStack justify="space-between">
                <VStack spacing={1} align="start">
                  <Text fontSize="sm" fontWeight="600" color={useColorModeValue('blue.700', 'primary.200')}>
                    Información del vehículo
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('blue.600', 'primary.300')}>
                    Ruta: {bus?.ruta} • {bus?.velocidad}
                  </Text>
                </VStack>
                <Badge 
                  colorScheme={bus?.estado === 'active' ? 'green' : bus?.estado === 'warning' ? 'orange' : 'red'}
                  fontSize="xs"
                >
                  {bus?.estado === 'active' ? 'En Ruta' : bus?.estado === 'warning' ? 'Con Retraso' : 'Fuera de Ruta'}
                </Badge>
              </HStack>
            </Box>

            {/* Quick Messages */}
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={2} color={textColor}>
                Mensajes rápidos:
              </Text>
              <Flex wrap="wrap" gap={2}>
                {quickMessages.map((quickMsg, index) => (
                  <Button
                    key={index}
                    size="xs"
                    variant="outline"
                    onClick={() => setMessage(quickMsg)}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    color={secondaryTextColor}
                    _hover={{
                      bg: useColorModeValue('gray.50', '#35394a'),
                      borderColor: useColorModeValue('blue.300', 'primary.500')
                    }}
                  >
                    {quickMsg}
                  </Button>
                ))}
              </Flex>
            </Box>

            {/* Message Input */}
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={2} color={textColor}>
                Mensaje a enviar:
              </Text>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje TTS aquí..."
                rows={4}
                resize="none"
                bg={inputBg}
                border="1px solid"
                borderColor={inputBorder}
                color={textColor}
                _placeholder={{ color: secondaryTextColor }}
                _hover={{
                  borderColor: useColorModeValue('blue.300', 'primary.500')
                }}
                _focus={{
                  borderColor: useColorModeValue('blue.500', 'primary.400'),
                  boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                }}
                maxLength={200}
              />
              <Text fontSize="xs" color={secondaryTextColor} mt={1} textAlign="right">
                {message.length}/200 caracteres
              </Text>
            </Box>

            {/* Delivery Status */}
            {deliveryStatus !== 'pending' && (
              <Box 
                p={3} 
                bg={useColorModeValue(
                  deliveryStatus === 'delivered' ? 'green.50' : 
                  deliveryStatus === 'failed' ? 'red.50' : 'blue.50',
                  deliveryStatus === 'delivered' ? 'green.900' : 
                  deliveryStatus === 'failed' ? 'red.900' : 'blue.900'
                )}
                borderRadius="lg"
                border="1px solid"
                borderColor={useColorModeValue(
                  deliveryStatus === 'delivered' ? 'green.200' : 
                  deliveryStatus === 'failed' ? 'red.200' : 'blue.200',
                  deliveryStatus === 'delivered' ? 'green.700' : 
                  deliveryStatus === 'failed' ? 'red.700' : 'blue.700'
                )}
              >
                <HStack spacing={2}>
                  {getDeliveryIcon()}
                  <Text 
                    fontSize="sm" 
                    color={useColorModeValue(
                      deliveryStatus === 'delivered' ? 'green.700' : 
                      deliveryStatus === 'failed' ? 'red.700' : 'blue.700',
                      deliveryStatus === 'delivered' ? 'green.200' : 
                      deliveryStatus === 'failed' ? 'red.200' : 'blue.200'
                    )}
                  >
                    {deliveryStatus === 'delivered' ? 'Mensaje entregado exitosamente' :
                     deliveryStatus === 'failed' ? 'Error al enviar el mensaje' :
                     'Mensaje enviado, esperando confirmación...'}
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button 
            variant="ghost" 
            onClick={onClose}
            color={secondaryTextColor}
            _hover={{ 
              bg: useColorModeValue('gray.100', '#35394a'),
              color: textColor
            }}
          >
            Cancelar
          </Button>
          <Button
            leftIcon={<Send size={16} />}
            colorScheme="blue"
            onClick={handleSendMessage}
            isLoading={isLoading}
            loadingText="Enviando..."
            isDisabled={!message.trim() || deliveryStatus === 'delivered'}
          >
            Enviar Mensaje
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MensajeTTSModal;