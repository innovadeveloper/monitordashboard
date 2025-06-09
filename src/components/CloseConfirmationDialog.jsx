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
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

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
                bg="red.100" 
                borderRadius="full"
                color="red.500"
              >
                <AlertTriangle size={20} />
              </Box>
              <Text>Confirmar Cierre</Text>
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
                  bg="gray.50" 
                  borderRadius="12px"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <HStack spacing={3} mb={3}>
                    <Camera size={16} color="gray.500" />
                    <Text fontWeight="600" color="gray.800">
                      {panelData.bus?.id}
                    </Text>
                    <Badge colorScheme="blue" fontSize="10px">
                      {panelData.cameraType?.toUpperCase()}
                    </Badge>
                  </HStack>
                  
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.600">
                      <strong>Conductor:</strong> {panelData.bus?.conductor}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <strong>Panel:</strong> {panelData.id}
                    </Text>
                  </VStack>
                </Box>
              )}

              <Box 
                p={3} 
                bg="orange.50" 
                borderRadius="8px"
                border="1px solid"
                borderColor="orange.200"
              >
                <Text fontSize="sm" color="orange.700">
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