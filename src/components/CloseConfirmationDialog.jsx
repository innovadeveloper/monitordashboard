// src/components/CloseConfirmationDialog.jsx
import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  VStack,
  HStack,
  Box,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { AlertTriangle, Camera, X } from 'lucide-react';

const CloseConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  panelData,
  cancelRef 
}) => {
  const bgColor = useColorModeValue('white', '#2f3441');
  const textColor = useColorModeValue('gray.600', '#a0aec0');

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg={bgColor} borderRadius="16px" mx={4}>
          <AlertDialogHeader 
            fontSize="lg" 
            fontWeight="bold"
            pb={2}
          >
            <HStack spacing={3}>
              <Box 
                p={2} 
                bg={useColorModeValue("red.100", "red.900")} 
                borderRadius="full"
                color={useColorModeValue("red.500", "red.300")}
              >
                <AlertTriangle size={20} />
              </Box>
              <Text color={useColorModeValue('gray.800', '#e2e8f0')}>Confirmar Cierre</Text>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack spacing={4} align="stretch">
              <Text color={textColor}>
                ¿Estás seguro de que deseas cerrar esta cámara?
              </Text>
              
              {panelData && (
                <Box 
                  p={4} 
                  bg={useColorModeValue("gray.50", "#35394a")} 
                  borderRadius="12px"
                  border="1px solid"
                  borderColor={useColorModeValue("gray.200", "transparent")}
                >
                  <HStack spacing={3} mb={3}>
                    <Camera size={16} color={useColorModeValue("gray.500", "#a0aec0")} />
                    <Text fontWeight="600" color={useColorModeValue("gray.800", "#e2e8f0")}>
                      {panelData.bus?.id}
                    </Text>
                    <Badge colorScheme="blue" fontSize="10px">
                      {panelData.cameraType?.toUpperCase()}
                    </Badge>
                  </HStack>
                  
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color={useColorModeValue("gray.600", "#a0aec0")}>
                      <strong>Conductor:</strong> {panelData.bus?.conductor}
                    </Text>
                    <Text fontSize="sm" color={useColorModeValue("gray.600", "#a0aec0")}>
                      <strong>Panel:</strong> {panelData.id}
                    </Text>
                  </VStack>
                </Box>
              )}

              <Box 
                p={3} 
                bg={useColorModeValue("orange.50", "orange.900")} 
                borderRadius="8px"
                border="1px solid"
                borderColor={useColorModeValue("orange.200", "orange.700")}
              >
                <Text fontSize="sm" color={useColorModeValue("orange.700", "orange.200")}>
                  <strong>Nota:</strong> Esta acción liberará el panel y detendrá la transmisión de video.
                </Text>
              </Box>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter gap={3}>
            <Button 
              ref={cancelRef} 
              onClick={onClose}
              variant="ghost"
              borderRadius="8px"
              color={useColorModeValue('gray.600', '#a0aec0')}
              _hover={{ 
                bg: useColorModeValue('gray.100', '#35394a'),
                color: useColorModeValue('gray.800', '#e2e8f0')
              }}
            >
              Cancelar
            </Button>
            <Button 
              colorScheme="red" 
              onClick={onConfirm}
              borderRadius="8px"
              leftIcon={<X size={16} />}
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(229, 62, 62, 0.4)'
              }}
            >
              Cerrar Cámara
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CloseConfirmationDialog;