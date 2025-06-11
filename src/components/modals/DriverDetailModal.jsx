// src/components/modals/DriverDetailModal.jsx
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
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { User, X, Save, AlertTriangle, Plus, Edit, Calendar, Award, BookOpen, Clock } from 'lucide-react';

const DriverDetailModal = ({ isOpen, onClose, driver, onSave }) => {
  const toast = useToast();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = React.useRef();

  // Initial form state
  const initialFormData = {
    // Personal Info
    nombre: '',
    apellidos: '',
    documento: '',
    telefono: '',
    email: '',
    direccion: '',
    fechaNacimiento: '',
    estado: 'Activo',
    
    // License Info
    licencia: '',
    tipoLicencia: '',
    fechaVencimientoLicencia: '',
    restricciones: '',
    
    // Work Info
    fechaIngreso: '',
    experiencia: '',
    categoria: '',
    salario: '',
    
    // Additional Info
    contactoEmergencia: '',
    observaciones: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalData, setOriginalData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for evaluations, trainings, and schedules
  const [evaluaciones] = useState([
    {
      id: 'EVAL-001',
      fecha: '2024-01-15',
      tipo: 'Desempeño',
      puntuacion: 85,
      evaluador: 'Supervisor García',
      comentarios: 'Buen desempeño general, puntual y responsable'
    },
    {
      id: 'EVAL-002',
      fecha: '2024-03-20',
      tipo: 'Seguridad',
      puntuacion: 92,
      evaluador: 'Inspector Martínez',
      comentarios: 'Excelente cumplimiento de normas de seguridad'
    }
  ]);

  const [capacitaciones] = useState([
    {
      id: 'CAP-001',
      curso: 'Manejo Defensivo',
      fecha: '2024-02-10',
      duracion: '16 horas',
      estado: 'Completado',
      certificado: 'Sí',
      instructor: 'Academia Vial Plus'
    },
    {
      id: 'CAP-002',
      curso: 'Primeros Auxilios',
      fecha: '2024-04-05',
      duracion: '8 horas',
      estado: 'Completado',
      certificado: 'Sí',
      instructor: 'Cruz Roja'
    },
    {
      id: 'CAP-003',
      curso: 'Atención al Cliente',
      fecha: '2024-06-15',
      duracion: '4 horas',
      estado: 'Pendiente',
      certificado: 'No',
      instructor: 'Capacitaciones Empresa'
    }
  ]);

  const [horarios] = useState([
    {
      dia: 'Lunes',
      entrada: '06:00',
      salida: '14:00',
      descanso: '10:00-10:30',
      ruta: 'Ruta 1 - Centro'
    },
    {
      dia: 'Martes',
      entrada: '06:00',
      salida: '14:00',
      descanso: '10:00-10:30',
      ruta: 'Ruta 1 - Centro'
    },
    {
      dia: 'Miércoles',
      entrada: '06:00',
      salida: '14:00',
      descanso: '10:00-10:30',
      ruta: 'Ruta 2 - Norte'
    },
    {
      dia: 'Jueves',
      entrada: '06:00',
      salida: '14:00',
      descanso: '10:00-10:30',
      ruta: 'Ruta 1 - Centro'
    },
    {
      dia: 'Viernes',
      entrada: '06:00',
      salida: '14:00',
      descanso: '10:00-10:30',
      ruta: 'Ruta 1 - Centro'
    },
    {
      dia: 'Sábado',
      entrada: 'Libre',
      salida: '',
      descanso: '',
      ruta: ''
    },
    {
      dia: 'Domingo',
      entrada: 'Libre',
      salida: '',
      descanso: '',
      ruta: ''
    }
  ]);

  // Check for changes
  useEffect(() => {
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(hasFormChanges);
  }, [formData, originalData]);

  // Initialize form when modal opens or driver changes
  useEffect(() => {
    if (isOpen && driver) {
      const data = {
        nombre: driver.nombre || '',
        apellidos: driver.apellidos || '',
        documento: driver.documento || '',
        telefono: driver.telefono || '',
        email: driver.email || '',
        direccion: driver.direccion || '',
        fechaNacimiento: driver.fechaNacimiento || '',
        estado: driver.estado || 'Activo',
        // Handle nested licencia object
        licencia: driver.licencia?.numero || driver.licencia || '',
        tipoLicencia: driver.licencia?.categoria || driver.tipoLicencia || '',
        fechaVencimientoLicencia: driver.licencia?.fechaVencimiento || driver.fechaVencimientoLicencia || '',
        restricciones: driver.restricciones || '',
        fechaIngreso: driver.fechaIngreso || '',
        experiencia: driver.experiencia || '',
        categoria: driver.categoria || '',
        salario: driver.salario || '',
        contactoEmergencia: driver.contactoEmergencia || '',
        observaciones: driver.observaciones || ''
      };
      
      setFormData(data);
      setOriginalData(data);
      setHasChanges(false);
      setIsEditing(false);
    }
  }, [isOpen, driver]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    if (hasChanges && isEditing) {
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
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (hasChanges) {
      onAlertOpen();
    } else {
      setIsEditing(false);
      setFormData(originalData);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const driverData = {
        ...driver,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        documento: formData.documento,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        fechaNacimiento: formData.fechaNacimiento,
        estado: formData.estado,
        fechaIngreso: formData.fechaIngreso,
        experiencia: formData.experiencia,
        categoria: formData.categoria,
        salario: formData.salario,
        contactoEmergencia: formData.contactoEmergencia,
        observaciones: formData.observaciones,
        // Restructure licencia as nested object
        licencia: {
          ...driver.licencia,
          numero: formData.licencia,
          categoria: formData.tipoLicencia,
          fechaVencimiento: formData.fechaVencimientoLicencia,
          estado: driver.licencia?.estado || 'Vigente'
        }
      };

      onSave(driverData);
      
      toast({
        title: 'Conductor actualizado',
        description: `${formData.nombre} ${formData.apellidos} ha sido actualizado exitosamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setOriginalData(formData);
      setIsEditing(false);
      setHasChanges(false);
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

  const getEvaluacionColor = (puntuacion) => {
    if (puntuacion >= 90) return 'green';
    if (puntuacion >= 80) return 'blue';
    if (puntuacion >= 70) return 'orange';
    return 'red';
  };

  const getCapacitacionColor = (estado) => {
    switch (estado) {
      case 'Completado': return 'green';
      case 'En Progreso': return 'blue';
      case 'Pendiente': return 'orange';
      default: return 'gray';
    }
  };

  const bgColor = useColorModeValue('white', '#252a36');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('white', '#2a2f3a');
  const inputBorder = useColorModeValue('gray.200', 'transparent');

  if (!driver) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="6xl" closeOnOverlayClick={false}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="xl" maxH="90vh">
          <ModalHeader>
            <HStack spacing={3} justify="space-between">
              <HStack spacing={3}>
                <Box
                  p={2}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  borderRadius="lg"
                >
                  <User size={20} color={useColorModeValue('#3182ce', '#63b3ed')} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold">
                    {driver.nombre} {driver.apellidos}
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    {driver.documento} • {driver.licencia?.numero || driver.licencia || 'Sin licencia'}
                  </Text>
                </VStack>
              </HStack>
              {!isEditing && (
                <Button
                  leftIcon={<Edit size={16} />}
                  colorScheme="blue"
                  size="sm"
                  onClick={handleEdit}
                >
                  Editar
                </Button>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody overflow="auto">
            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab><HStack spacing={2}><User size={16} /><Text>Información Personal</Text></HStack></Tab>
                <Tab><HStack spacing={2}><Award size={16} /><Text>Licencia</Text></HStack></Tab>
                <Tab><HStack spacing={2}><Clock size={16} /><Text>Horarios</Text></HStack></Tab>
                <Tab><HStack spacing={2}><BookOpen size={16} /><Text>Evaluaciones</Text></HStack></Tab>
                <Tab><HStack spacing={2}><Calendar size={16} /><Text>Capacitaciones</Text></HStack></Tab>
              </TabList>

              <TabPanels>
                {/* Personal Information Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontSize="md" fontWeight="semibold" mb={4} color={useColorModeValue('gray.700', 'gray.300')}>
                        Datos Personales
                      </Text>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Nombre</FormLabel>
                            <Input
                              value={formData.nombre}
                              onChange={(e) => handleInputChange('nombre', e.target.value)}
                              placeholder="Nombre"
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Apellidos</FormLabel>
                            <Input
                              value={formData.apellidos}
                              onChange={(e) => handleInputChange('apellidos', e.target.value)}
                              placeholder="Apellidos"
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Documento</FormLabel>
                            <Input
                              value={formData.documento}
                              onChange={(e) => handleInputChange('documento', e.target.value)}
                              placeholder="Documento"
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Teléfono</FormLabel>
                            <Input
                              value={formData.telefono}
                              onChange={(e) => handleInputChange('telefono', e.target.value)}
                              placeholder="Teléfono"
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Email</FormLabel>
                            <Input
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Email"
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Estado</FormLabel>
                            <Select
                              value={formData.estado}
                              onChange={(e) => handleInputChange('estado', e.target.value)}
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isDisabled={!isEditing}
                            >
                              <option value="Activo">Activo</option>
                              <option value="Inactivo">Inactivo</option>
                              <option value="Vacaciones">Vacaciones</option>
                              <option value="Suspendido">Suspendido</option>
                            </Select>
                          </FormControl>
                        </GridItem>
                        
                        <GridItem colSpan={2}>
                          <FormControl>
                            <FormLabel fontSize="sm">Dirección</FormLabel>
                            <Input
                              value={formData.direccion}
                              onChange={(e) => handleInputChange('direccion', e.target.value)}
                              placeholder="Dirección"
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Text fontSize="md" fontWeight="semibold" mb={4} color={useColorModeValue('gray.700', 'gray.300')}>
                        Información Laboral
                      </Text>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Fecha de Ingreso</FormLabel>
                            <Input
                              type="date"
                              value={formData.fechaIngreso}
                              onChange={(e) => handleInputChange('fechaIngreso', e.target.value)}
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Experiencia</FormLabel>
                            <Input
                              value={formData.experiencia}
                              onChange={(e) => handleInputChange('experiencia', e.target.value)}
                              placeholder="Años de experiencia"
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Categoría</FormLabel>
                            <Select
                              value={formData.categoria}
                              onChange={(e) => handleInputChange('categoria', e.target.value)}
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isDisabled={!isEditing}
                            >
                              <option value="">Seleccionar</option>
                              <option value="Junior">Junior</option>
                              <option value="Senior">Senior</option>
                              <option value="Especialista">Especialista</option>
                            </Select>
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm">Contacto de Emergencia</FormLabel>
                            <Input
                              value={formData.contactoEmergencia}
                              onChange={(e) => handleInputChange('contactoEmergencia', e.target.value)}
                              placeholder="Contacto de emergencia"
                              size="sm"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="lg"
                              isReadOnly={!isEditing}
                            />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* License Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Text fontSize="md" fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                      Información de Licencia
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel fontSize="sm">Número de Licencia</FormLabel>
                          <Input
                            value={formData.licencia}
                            onChange={(e) => handleInputChange('licencia', e.target.value)}
                            placeholder="Número de licencia"
                            size="sm"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="lg"
                            isReadOnly={!isEditing}
                          />
                        </FormControl>
                      </GridItem>
                      
                      <GridItem>
                        <FormControl>
                          <FormLabel fontSize="sm">Tipo de Licencia</FormLabel>
                          <Select
                            value={formData.tipoLicencia}
                            onChange={(e) => handleInputChange('tipoLicencia', e.target.value)}
                            size="sm"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="lg"
                            isDisabled={!isEditing}
                          >
                            <option value="">Seleccionar</option>
                            <option value="A-I">A-I</option>
                            <option value="A-IIa">A-IIa</option>
                            <option value="A-IIb">A-IIb</option>
                            <option value="A-IIIa">A-IIIa</option>
                            <option value="A-IIIb">A-IIIb</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      
                      <GridItem>
                        <FormControl>
                          <FormLabel fontSize="sm">Fecha de Vencimiento</FormLabel>
                          <Input
                            type="date"
                            value={formData.fechaVencimientoLicencia}
                            onChange={(e) => handleInputChange('fechaVencimientoLicencia', e.target.value)}
                            size="sm"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="lg"
                            isReadOnly={!isEditing}
                          />
                        </FormControl>
                      </GridItem>
                      
                      <GridItem>
                        <FormControl>
                          <FormLabel fontSize="sm">Restricciones</FormLabel>
                          <Textarea
                            value={formData.restricciones}
                            onChange={(e) => handleInputChange('restricciones', e.target.value)}
                            placeholder="Restricciones de la licencia"
                            size="sm"
                            rows={3}
                            resize="none"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="lg"
                            isReadOnly={!isEditing}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </VStack>
                </TabPanel>

                {/* Schedule Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="md" fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                      Horarios de Trabajo
                    </Text>
                    <Box
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      overflow="hidden"
                    >
                      <Table variant="simple" size="sm">
                        <Thead bg={useColorModeValue('gray.50', '#35394a')}>
                          <Tr>
                            <Th>Día</Th>
                            <Th>Entrada</Th>
                            <Th>Salida</Th>
                            <Th>Descanso</Th>
                            <Th>Ruta Asignada</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {horarios.map((horario) => (
                            <Tr key={horario.dia}>
                              <Td fontWeight="semibold">{horario.dia}</Td>
                              <Td>{horario.entrada}</Td>
                              <Td>{horario.salida}</Td>
                              <Td>{horario.descanso}</Td>
                              <Td>{horario.ruta}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Evaluations Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="md" fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                        Evaluaciones de Desempeño
                      </Text>
                      <Button leftIcon={<Plus size={16} />} size="sm" colorScheme="blue">
                        Nueva Evaluación
                      </Button>
                    </HStack>
                    <Box
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      overflow="hidden"
                    >
                      <Table variant="simple" size="sm">
                        <Thead bg={useColorModeValue('gray.50', '#35394a')}>
                          <Tr>
                            <Th>Fecha</Th>
                            <Th>Tipo</Th>
                            <Th>Puntuación</Th>
                            <Th>Evaluador</Th>
                            <Th>Comentarios</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {evaluaciones.map((evaluacion) => (
                            <Tr key={evaluacion.id}>
                              <Td>{evaluacion.fecha}</Td>
                              <Td>{evaluacion.tipo}</Td>
                              <Td>
                                <Badge colorScheme={getEvaluacionColor(evaluacion.puntuacion)}>
                                  {evaluacion.puntuacion}/100
                                </Badge>
                              </Td>
                              <Td>{evaluacion.evaluador}</Td>
                              <Td>
                                <Text noOfLines={2} title={evaluacion.comentarios}>
                                  {evaluacion.comentarios}
                                </Text>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Training Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="md" fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                        Capacitaciones y Certificaciones
                      </Text>
                      <Button leftIcon={<Plus size={16} />} size="sm" colorScheme="green">
                        Nueva Capacitación
                      </Button>
                    </HStack>
                    <Box
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      overflow="hidden"
                    >
                      <Table variant="simple" size="sm">
                        <Thead bg={useColorModeValue('gray.50', '#35394a')}>
                          <Tr>
                            <Th>Curso</Th>
                            <Th>Fecha</Th>
                            <Th>Duración</Th>
                            <Th>Estado</Th>
                            <Th>Certificado</Th>
                            <Th>Instructor</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {capacitaciones.map((capacitacion) => (
                            <Tr key={capacitacion.id}>
                              <Td fontWeight="medium">{capacitacion.curso}</Td>
                              <Td>{capacitacion.fecha}</Td>
                              <Td>{capacitacion.duracion}</Td>
                              <Td>
                                <Badge colorScheme={getCapacitacionColor(capacitacion.estado)}>
                                  {capacitacion.estado}
                                </Badge>
                              </Td>
                              <Td>
                                <Badge colorScheme={capacitacion.certificado === 'Sí' ? 'green' : 'gray'}>
                                  {capacitacion.certificado}
                                </Badge>
                              </Td>
                              <Td>{capacitacion.instructor}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={isEditing ? handleCancelEdit : handleClose}
                leftIcon={<X size={16} />}
                size="sm"
              >
                {isEditing ? 'Cancelar' : 'Cerrar'}
              </Button>
              {isEditing && (
                <Button
                  colorScheme="blue"
                  onClick={handleSave}
                  isLoading={isLoading}
                  loadingText="Guardando..."
                  leftIcon={<Save size={16} />}
                  size="sm"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'md'
                  }}
                  transition="all 0.2s"
                >
                  Guardar Cambios
                </Button>
              )}
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
              <Button 
                colorScheme="red" 
                onClick={() => {
                  onAlertClose();
                  setIsEditing(false);
                  setFormData(originalData);
                  setHasChanges(false);
                }} 
                ml={3} 
                size="sm"
              >
                Descartar cambios
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DriverDetailModal;