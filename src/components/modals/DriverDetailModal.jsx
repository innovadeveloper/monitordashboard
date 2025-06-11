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
  
  // Modal states for adding new evaluations and trainings
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  // Mock data for evaluations, trainings, and schedules
  const [evaluaciones, setEvaluaciones] = useState([
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

  const [capacitaciones, setCapacitaciones] = useState([
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

  // Handle new evaluation
  const handleNewEvaluation = (newEvaluation) => {
    const evaluationWithId = {
      ...newEvaluation,
      id: `EVAL-${String(Date.now()).slice(-3)}`,
      fecha: new Date().toISOString().split('T')[0]
    };
    setEvaluaciones(prev => [...prev, evaluationWithId]);
    setIsEvaluationModalOpen(false);
    
    toast({
      title: 'Evaluación agregada',
      description: `Nueva evaluación de ${newEvaluation.tipo} registrada`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle new training
  const handleNewTraining = (newTraining) => {
    const trainingWithId = {
      ...newTraining,
      id: `CAP-${String(Date.now()).slice(-3)}`,
      fecha: new Date().toISOString().split('T')[0]
    };
    setCapacitaciones(prev => [...prev, trainingWithId]);
    setIsTrainingModalOpen(false);
    
    toast({
      title: 'Capacitación agregada',
      description: `Nueva capacitación de ${newTraining.curso} registrada`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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
                      <Button 
                        leftIcon={<Plus size={16} />} 
                        size="sm" 
                        colorScheme="blue"
                        onClick={() => setIsEvaluationModalOpen(true)}
                      >
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
                      <Button 
                        leftIcon={<Plus size={16} />} 
                        size="sm" 
                        colorScheme="green"
                        onClick={() => setIsTrainingModalOpen(true)}
                      >
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

      {/* New Evaluation Modal */}
      <EvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        onSave={handleNewEvaluation}
        driverName={`${driver?.nombre} ${driver?.apellidos}`}
      />

      {/* New Training Modal */}
      <TrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        onSave={handleNewTraining}
        driverName={`${driver?.nombre} ${driver?.apellidos}`}
      />
    </>
  );
};

// Evaluation Modal Component
const EvaluationModal = ({ isOpen, onClose, onSave, driverName }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    puntuacion: '',
    evaluador: '',
    comentarios: ''
  });

  const toast = useToast();
  const bgColor = useColorModeValue('white', '#252a36');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = () => {
    if (!formData.tipo || !formData.puntuacion || !formData.evaluador) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos obligatorios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSave(formData);
    setFormData({
      tipo: '',
      puntuacion: '',
      evaluador: '',
      comentarios: ''
    });
  };

  const handleClose = () => {
    setFormData({
      tipo: '',
      puntuacion: '',
      evaluador: '',
      comentarios: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={bgColor} border="1px solid" borderColor={borderColor}>
        <ModalHeader>
          <HStack spacing={3}>
            <Box
              p={2}
              bg={useColorModeValue('blue.50', 'blue.900')}
              borderRadius="lg"
            >
              <Award size={20} color={useColorModeValue('#3182ce', '#63b3ed')} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text>Nueva Evaluación</Text>
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                {driverName}
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="sm">Tipo de Evaluación</FormLabel>
              <Select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                placeholder="Seleccionar tipo"
                size="sm"
              >
                <option value="Desempeño">Desempeño</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Manejo Defensivo">Manejo Defensivo</option>
                <option value="Conocimiento de Rutas">Conocimiento de Rutas</option>
                <option value="Atención al Usuario">Atención al Usuario</option>
                <option value="Seguridad Vehicular">Seguridad Vehicular</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Puntuación (0-100)</FormLabel>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.puntuacion}
                onChange={(e) => setFormData({...formData, puntuacion: e.target.value})}
                placeholder="Ej: 85"
                size="sm"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Evaluador</FormLabel>
              <Input
                value={formData.evaluador}
                onChange={(e) => setFormData({...formData, evaluador: e.target.value})}
                placeholder="Nombre del evaluador"
                size="sm"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Comentarios</FormLabel>
              <Textarea
                value={formData.comentarios}
                onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
                placeholder="Observaciones sobre la evaluación..."
                rows={3}
                resize="none"
                size="sm"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose} size="sm">
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit} size="sm">
              Agregar Evaluación
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Training Modal Component
const TrainingModal = ({ isOpen, onClose, onSave, driverName }) => {
  const [formData, setFormData] = useState({
    curso: '',
    duracion: '',
    instructor: '',
    estado: 'Pendiente',
    certificado: 'No'
  });

  const toast = useToast();
  const bgColor = useColorModeValue('white', '#252a36');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = () => {
    if (!formData.curso || !formData.duracion || !formData.instructor) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos obligatorios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSave(formData);
    setFormData({
      curso: '',
      duracion: '',
      instructor: '',
      estado: 'Pendiente',
      certificado: 'No'
    });
  };

  const handleClose = () => {
    setFormData({
      curso: '',
      duracion: '',
      instructor: '',
      estado: 'Pendiente',
      certificado: 'No'
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={bgColor} border="1px solid" borderColor={borderColor}>
        <ModalHeader>
          <HStack spacing={3}>
            <Box
              p={2}
              bg={useColorModeValue('green.50', 'green.900')}
              borderRadius="lg"
            >
              <BookOpen size={20} color={useColorModeValue('#38a169', '#68d391')} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text>Nueva Capacitación</Text>
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                {driverName}
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="sm">Curso/Capacitación</FormLabel>
              <Input
                value={formData.curso}
                onChange={(e) => setFormData({...formData, curso: e.target.value})}
                placeholder="Ej: Manejo Defensivo"
                size="sm"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Duración</FormLabel>
              <Input
                value={formData.duracion}
                onChange={(e) => setFormData({...formData, duracion: e.target.value})}
                placeholder="Ej: 8 horas"
                size="sm"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Instructor/Institución</FormLabel>
              <Input
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                placeholder="Nombre del instructor o institución"
                size="sm"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Estado</FormLabel>
              <Select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                size="sm"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completado">Completado</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Certificado</FormLabel>
              <Select
                value={formData.certificado}
                onChange={(e) => setFormData({...formData, certificado: e.target.value})}
                size="sm"
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose} size="sm">
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleSubmit} size="sm">
              Agregar Capacitación
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DriverDetailModal;