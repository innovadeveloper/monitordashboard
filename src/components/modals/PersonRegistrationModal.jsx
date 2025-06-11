// src/components/modals/PersonRegistrationModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  VStack,
  HStack,
  Grid,
  GridItem,
  useColorModeValue,
  useToast,
  Textarea,
  Box,
  Divider,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { UserPlus, X, Save, AlertTriangle } from 'lucide-react';

const PersonRegistrationModal = ({ isOpen, onClose, person = null, onSave }) => {
  const toast = useToast();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = React.useRef();

  // Initial form state
  const initialFormData = {
    nombre: '',
    apellidos: '',
    documento: '',
    tipoDocumento: 'DNI',
    telefono: '',
    email: '',
    direccion: '',
    fechaNacimiento: '',
    estado: 'Activo',
    contactoEmergencia: '',
    observaciones: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalData, setOriginalData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes
  useEffect(() => {
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(hasFormChanges);
  }, [formData, originalData]);

  // Initialize form when modal opens or person changes
  useEffect(() => {
    if (isOpen) {
      const data = person ? {
        nombre: person.nombre || '',
        apellidos: person.apellidos || '',
        documento: person.documento || '',
        tipoDocumento: person.tipoDocumento || 'DNI',
        telefono: person.telefono || '',
        email: person.email || '',
        direccion: person.direccion || '',
        fechaNacimiento: person.fechaNacimiento || '',
        estado: person.estado || 'Activo',
        contactoEmergencia: person.contactoEmergencia || '',
        observaciones: person.observaciones || ''
      } : initialFormData;
      
      setFormData(data);
      setOriginalData(data);
      setHasChanges(false);
    }
  }, [isOpen, person]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    if (hasChanges) {
      onAlertOpen();
    } else {
      onClose();
      resetForm();
    }
  };

  const confirmClose = () => {
    onAlertClose();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setOriginalData(initialFormData);
    setHasChanges(false);
  };

  const validateForm = () => {
    const requiredFields = ['nombre', 'apellidos', 'documento', 'telefono', 'email'];
    
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        toast({
          title: 'Campo requerido',
          description: `El campo ${field} es obligatorio`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor ingresa un email válido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{8,15}$/;
    if (!phoneRegex.test(formData.telefono)) {
      toast({
        title: 'Teléfono inválido',
        description: 'Por favor ingresa un teléfono válido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const personData = {
        ...formData,
        id: person?.id || `PER-${String(Date.now()).slice(-3)}`,
        fechaRegistro: person?.fechaRegistro || new Date().toISOString().split('T')[0]
      };

      onSave(personData);
      
      toast({
        title: person ? 'Persona actualizada' : 'Persona registrada',
        description: `${formData.nombre} ${formData.apellidos} ha sido ${person ? 'actualizada' : 'registrada'} exitosamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: 'Ha ocurrido un error al procesar la solicitud',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue('white', '#252a36');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('white', '#2a2f3a');
  const inputBorder = useColorModeValue('gray.200', 'transparent');

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="4xl" closeOnOverlayClick={false}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="xl">
          <ModalHeader>
            <HStack spacing={3}>
              <Box
                p={2}
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="lg"
              >
                <UserPlus size={20} color={useColorModeValue('#3182ce', '#63b3ed')} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">
                  {person ? 'Editar Persona' : 'Registrar Nueva Persona'}
                </Text>
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                  {person ? 'Modifica la información de la persona' : 'Completa la información para registrar una nueva persona'}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Personal Information */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={4} color={useColorModeValue('gray.700', 'gray.300')}>
                  Información Personal
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Nombre</FormLabel>
                      <Input
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Ingresa el nombre"
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Apellidos</FormLabel>
                      <Input
                        value={formData.apellidos}
                        onChange={(e) => handleInputChange('apellidos', e.target.value)}
                        placeholder="Ingresa los apellidos"
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Tipo de Documento</FormLabel>
                      <Select
                        value={formData.tipoDocumento}
                        onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      >
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Carnet de Extranjería">Carnet de Extranjería</option>
                      </Select>
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Número de Documento</FormLabel>
                      <Input
                        value={formData.documento}
                        onChange={(e) => handleInputChange('documento', e.target.value)}
                        placeholder="Ingresa el número de documento"
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize="sm">Fecha de Nacimiento</FormLabel>
                      <Input
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Estado</FormLabel>
                      <Select
                        value={formData.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </Select>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Divider />

              {/* Contact Information */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={4} color={useColorModeValue('gray.700', 'gray.300')}>
                  Información de Contacto
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Teléfono</FormLabel>
                      <Input
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        placeholder="+51 999 123 456"
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Email</FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="ejemplo@email.com"
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize="sm">Dirección</FormLabel>
                      <Input
                        value={formData.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        placeholder="Ingresa la dirección completa"
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize="sm">Contacto de Emergencia</FormLabel>
                      <Input
                        value={formData.contactoEmergencia}
                        onChange={(e) => handleInputChange('contactoEmergencia', e.target.value)}
                        placeholder="Nombre y teléfono del contacto de emergencia"
                        size="sm"
                        bg={inputBg}
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _hover={{ 
                          borderColor: useColorModeValue('blue.300', 'primary.600')
                        }}
                        _focus={{ 
                          borderColor: useColorModeValue('blue.500', 'primary.500'),
                          boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                        }}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Divider />

              {/* Additional Information */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={4} color={useColorModeValue('gray.700', 'gray.300')}>
                  Información Adicional
                </Text>
                <FormControl>
                  <FormLabel fontSize="sm">Observaciones</FormLabel>
                  <Textarea
                    value={formData.observaciones}
                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                    placeholder="Información adicional o comentarios..."
                    size="sm"
                    rows={3}
                    resize="none"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={inputBorder}
                    borderRadius="lg"
                    _hover={{ 
                      borderColor: useColorModeValue('blue.300', 'primary.600')
                    }}
                    _focus={{ 
                      borderColor: useColorModeValue('blue.500', 'primary.500'),
                      boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                    }}
                  />
                </FormControl>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={handleClose}
                leftIcon={<X size={16} />}
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSave}
                isLoading={isLoading}
                loadingText={person ? "Actualizando..." : "Guardando..."}
                leftIcon={<Save size={16} />}
                size="sm"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'md'
                }}
                transition="all 0.2s"
              >
                {person ? 'Actualizar' : 'Guardar'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={bgColor} border="1px solid" borderColor={borderColor}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack spacing={2}>
                <AlertTriangle size={20} color={useColorModeValue('#f56565', '#fc8181')} />
                <Text>¿Descartar cambios?</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Tienes cambios sin guardar. ¿Estás seguro de que deseas cerrar sin guardar? 
                Se perderán todos los cambios realizados.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose} size="sm">
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmClose} ml={3} size="sm">
                Descartar cambios
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default PersonRegistrationModal;