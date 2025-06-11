// src/components/SystemManagementPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  IconButton,
  useColorMode,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Grid,
  GridItem,
  Select,
  useToast,
  Divider,
  Center,
} from '@chakra-ui/react';
import { 
  Home, 
  User, 
  ChevronDown, 
  Sun, 
  Moon,
  Settings,
  Users,
  UserCheck,
  Shield,
  Sliders,
  Plus,
  Edit,
  Eye,
  UserPlus,
  X,
  Save,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 1. IMPORTS
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';

// Hooks and Contexts
import { useAuth } from '../../contexts/AuthContext';

// Mock data for roles
const mockRoles = [
  {
    id: 'ROL-001',
    nombre: 'Administrador',
    descripcion: 'Acceso completo al sistema',
    modulos: ['Monitoreo', 'Gestión de Recursos', 'Administración', 'Operativa', 'Control y Alertas'],
    usuarios: ['admin@empresa.com', 'supervisor@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-01-15'
  },
  {
    id: 'ROL-002',
    nombre: 'Supervisor',
    descripcion: 'Supervisión de operaciones',
    modulos: ['Monitoreo', 'Control y Alertas', 'Gestión de Recursos'],
    usuarios: ['supervisor1@empresa.com', 'supervisor2@empresa.com', 'jefe.ops@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-01-20'
  },
  {
    id: 'ROL-003',
    nombre: 'Operador',
    descripcion: 'Operación básica del sistema',
    modulos: ['Monitoreo'],
    usuarios: ['operador1@empresa.com', 'operador2@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-02-01'
  },
  {
    id: 'ROL-004',
    nombre: 'Conductor',
    descripcion: 'Acceso limitado para conductores',
    modulos: ['Monitoreo'],
    usuarios: ['juan.perez@empresa.com', 'maria.gonzalez@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-02-10'
  },
  {
    id: 'ROL-005',
    nombre: 'Consultor',
    descripcion: 'Solo lectura para consultas',
    modulos: ['Monitoreo'],
    usuarios: ['consultor@empresa.com'],
    estado: 'Inactivo',
    fechaCreacion: '2024-03-01'
  },
  {
    id: 'ROL-006',
    nombre: 'Supervisor de Flota',
    descripcion: 'Supervisión especializada en vehículos',
    modulos: ['Monitoreo', 'Gestión de Recursos'],
    usuarios: ['supervisor.flota@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-05'
  },
  {
    id: 'ROL-007',
    nombre: 'Analista de Datos',
    descripcion: 'Análisis de información y reportes',
    modulos: ['Monitoreo', 'Analytics y Reportes'],
    usuarios: ['analista1@empresa.com', 'analista2@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-10'
  },
  {
    id: 'ROL-008',
    nombre: 'Jefe de Operaciones',
    descripcion: 'Dirección operativa general',
    modulos: ['Monitoreo', 'Operativa', 'Control y Alertas', 'Gestión de Recursos'],
    usuarios: ['jefe.operaciones@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-12'
  },
  {
    id: 'ROL-009',
    nombre: 'Técnico de Mantenimiento',
    descripcion: 'Gestión de mantenimiento de flota',
    modulos: ['Gestión de Recursos'],
    usuarios: ['tecnico1@empresa.com', 'tecnico2@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-15'
  },
  {
    id: 'ROL-010',
    nombre: 'Coordinador de Rutas',
    descripcion: 'Planificación y optimización de rutas',
    modulos: ['Monitoreo', 'Operativa'],
    usuarios: ['coordinador.rutas@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-18'
  },
  {
    id: 'ROL-011',
    nombre: 'Auditor',
    descripcion: 'Revisión y auditoria del sistema',
    modulos: ['Monitoreo', 'Analytics y Reportes'],
    usuarios: ['auditor@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-20'
  },
  {
    id: 'ROL-012',
    nombre: 'Operador Nocturno',
    descripcion: 'Operación durante turno nocturno',
    modulos: ['Monitoreo', 'Control y Alertas'],
    usuarios: ['operador.noche1@empresa.com', 'operador.noche2@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-22'
  },
  {
    id: 'ROL-013',
    nombre: 'Supervisor de Seguridad',
    descripcion: 'Supervisión de aspectos de seguridad',
    modulos: ['Monitoreo', 'Control y Alertas'],
    usuarios: ['supervisor.seguridad@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-25'
  },
  {
    id: 'ROL-014',
    nombre: 'Gestor de Personal',
    descripcion: 'Administración de recursos humanos',
    modulos: ['Gestión de Recursos', 'Administración del Sistema'],
    usuarios: ['rrhh@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-03-28'
  },
  {
    id: 'ROL-015',
    nombre: 'Contador',
    descripcion: 'Gestión financiera y contable',
    modulos: ['Analytics y Reportes'],
    usuarios: ['contador@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-01'
  },
  {
    id: 'ROL-016',
    nombre: 'Inspector de Calidad',
    descripcion: 'Control de calidad del servicio',
    modulos: ['Monitoreo', 'Analytics y Reportes'],
    usuarios: ['inspector@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-03'
  },
  {
    id: 'ROL-017',
    nombre: 'Coordinador de Emergencias',
    descripcion: 'Gestión de situaciones de emergencia',
    modulos: ['Monitoreo', 'Control y Alertas', 'Operativa'],
    usuarios: ['emergencias@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-05'
  },
  {
    id: 'ROL-018',
    nombre: 'Desarrollador',
    descripcion: 'Desarrollo y mantenimiento del sistema',
    modulos: ['Administración del Sistema'],
    usuarios: ['dev1@empresa.com', 'dev2@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-08'
  },
  {
    id: 'ROL-019',
    nombre: 'Conductor Senior',
    descripcion: 'Conductor con permisos adicionales',
    modulos: ['Monitoreo', 'Operativa'],
    usuarios: ['conductor.senior1@empresa.com', 'conductor.senior2@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-10'
  },
  {
    id: 'ROL-020',
    nombre: 'Planificador de Horarios',
    descripcion: 'Planificación de horarios y turnos',
    modulos: ['Operativa', 'Gestión de Recursos'],
    usuarios: ['planificador@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-12'
  },
  {
    id: 'ROL-021',
    nombre: 'Especialista en Combustible',
    descripcion: 'Gestión y control de combustible',
    modulos: ['Analytics y Reportes', 'Gestión de Recursos'],
    usuarios: ['combustible@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-15'
  },
  {
    id: 'ROL-022',
    nombre: 'Supervisor de Turno',
    descripcion: 'Supervisión por turnos rotativos',
    modulos: ['Monitoreo', 'Control y Alertas'],
    usuarios: ['supervisor.turno1@empresa.com', 'supervisor.turno2@empresa.com', 'supervisor.turno3@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-18'
  },
  {
    id: 'ROL-023',
    nombre: 'Agente de Atención al Cliente',
    descripcion: 'Atención y soporte a usuarios',
    modulos: ['Monitoreo'],
    usuarios: ['atencion1@empresa.com', 'atencion2@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-20'
  },
  {
    id: 'ROL-024',
    nombre: 'Gerente Regional',
    descripcion: 'Gestión regional de operaciones',
    modulos: ['Monitoreo', 'Analytics y Reportes', 'Gestión de Recursos', 'Operativa'],
    usuarios: ['gerente.regional@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-22'
  },
  {
    id: 'ROL-025',
    nombre: 'Especialista GPS',
    descripcion: 'Especialista en sistemas GPS y seguimiento',
    modulos: ['Monitoreo', 'Administración del Sistema'],
    usuarios: ['especialista.gps@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-25'
  },
  {
    id: 'ROL-026',
    nombre: 'Coordinador Logístico',
    descripcion: 'Coordinación de aspectos logísticos',
    modulos: ['Operativa', 'Gestión de Recursos'],
    usuarios: ['logistica@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-04-28'
  },
  {
    id: 'ROL-027',
    nombre: 'Supervisor de Limpieza',
    descripcion: 'Supervisión de limpieza de vehículos',
    modulos: ['Gestión de Recursos'],
    usuarios: ['limpieza@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-05-01'
  },
  {
    id: 'ROL-028',
    nombre: 'Analista de Rendimiento',
    descripcion: 'Análisis de rendimiento operativo',
    modulos: ['Analytics y Reportes', 'Monitoreo'],
    usuarios: ['analista.rendimiento@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-05-03'
  },
  {
    id: 'ROL-029',
    nombre: 'Coordinador de Capacitación',
    descripcion: 'Organización de programas de capacitación',
    modulos: ['Gestión de Recursos'],
    usuarios: ['capacitacion@empresa.com'],
    estado: 'Activo',
    fechaCreacion: '2024-05-05'
  },
  {
    id: 'ROL-030',
    nombre: 'Usuario Temporal',
    descripcion: 'Acceso temporal para visitantes',
    modulos: ['Monitoreo'],
    usuarios: ['temp1@empresa.com'],
    estado: 'Inactivo',
    fechaCreacion: '2024-05-08'
  }
];

// Mock data for available modules
const availableModules = [
  'Monitoreo',
  'Operativa', 
  'Control y Alertas',
  'Gestión de Recursos',
  'Analytics y Reportes',
  'Administración del Sistema'
];

// Mock data for users
const mockUsers = [
  { email: 'admin@empresa.com', nombre: 'Administrator' },
  { email: 'supervisor@empresa.com', nombre: 'Supervisor Principal' },
  { email: 'supervisor1@empresa.com', nombre: 'Supervisor 1' },
  { email: 'supervisor2@empresa.com', nombre: 'Supervisor 2' },
  { email: 'jefe.ops@empresa.com', nombre: 'Jefe de Operaciones' },
  { email: 'operador1@empresa.com', nombre: 'Operador 1' },
  { email: 'operador2@empresa.com', nombre: 'Operador 2' },
  { email: 'juan.perez@empresa.com', nombre: 'Juan Pérez' },
  { email: 'maria.gonzalez@empresa.com', nombre: 'María González' },
  { email: 'consultor@empresa.com', nombre: 'Consultor Externo' }
];

// Role Management Sub-module
const RoleManagementSubModule = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    modulos: [],
    estado: 'Activo'
  });
  const [assignData, setAssignData] = useState({
    usuarios: []
  });
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const toast = useToast();

  // Calculate pagination
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = roles.slice(startIndex, endIndex);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setFormData({
      nombre: '',
      descripcion: '',
      modulos: [],
      estado: 'Activo'
    });
    setIsCreateModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setFormData({
      nombre: role.nombre,
      descripcion: role.descripcion,
      modulos: role.modulos,
      estado: role.estado
    });
    setIsCreateModalOpen(true);
  };

  const handleAssignUsers = (role) => {
    setSelectedRole(role);
    setAssignData({
      usuarios: role.usuarios || []
    });
    setUserSearchTerm('');
    setFilteredUsers(mockUsers);
    setIsAssignModalOpen(true);
  };

  // Filter users based on search term
  React.useEffect(() => {
    const filtered = mockUsers.filter(user =>
      user.nombre.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [userSearchTerm]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleSaveRole = () => {
    if (!formData.nombre.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre del rol es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const roleData = {
      ...formData,
      id: selectedRole?.id || `ROL-${String(Date.now()).slice(-3)}`,
      usuarios: selectedRole?.usuarios || [],
      fechaCreacion: selectedRole?.fechaCreacion || new Date().toISOString().split('T')[0]
    };

    if (selectedRole) {
      setRoles(roles.map(r => r.id === selectedRole.id ? roleData : r));
      toast({
        title: 'Rol actualizado',
        description: `El rol "${formData.nombre}" ha sido actualizado`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      const newRoles = [...roles, roleData];
      setRoles(newRoles);
      // Navigate to last page if new role was added
      const newTotalPages = Math.ceil(newRoles.length / itemsPerPage);
      setCurrentPage(newTotalPages);
      toast({
        title: 'Rol creado',
        description: `El rol "${formData.nombre}" ha sido creado`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }

    setIsCreateModalOpen(false);
  };

  const handleSaveAssignment = () => {
    const updatedRole = {
      ...selectedRole,
      usuarios: assignData.usuarios
    };

    setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
    toast({
      title: 'Usuarios asignados',
      description: `Se han asignado ${assignData.usuarios.length} usuarios al rol "${selectedRole.nombre}"`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsAssignModalOpen(false);
  };

  const getEstadoColor = (estado) => {
    return estado === 'Activo' ? 'green' : 'red';
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Gestión de Roles
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Administre los roles y permisos del sistema
          </Text>
        </Box>
        <Button
          leftIcon={<Plus size={16} />}
          colorScheme="blue"
          size="sm"
          onClick={handleCreateRole}
        >
          Crear Rol
        </Button>
      </Flex>

      {/* Table Container */}
      <Box flex={1} overflow="hidden" mb={4}>
        <Box 
          h="100%"
          borderRadius="lg" 
          border="1px solid" 
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          bg={useColorModeValue('white', '#2f3441')}
        >
        {/* Fixed Header */}
        <Box 
          bg={useColorModeValue('gray.50', '#35394a')}
          borderBottom="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th w="120px" fontSize="xs" py={3}>ID Rol</Th>
                <Th w="150px" fontSize="xs" py={3}>Nombre</Th>
                <Th w="200px" fontSize="xs" py={3}>Descripción</Th>
                <Th w="250px" fontSize="xs" py={3}>Módulos de Acceso</Th>
                <Th w="100px" fontSize="xs" py={3}>Usuarios</Th>
                <Th w="100px" fontSize="xs" py={3}>Estado</Th>
                <Th w="150px" fontSize="xs" py={3}>Acciones</Th>
              </Tr>
            </Thead>
          </Table>
        </Box>
        
        {/* Scrollable Body */}
        <Box 
          overflow="auto" 
          h="calc(100% - 45px)"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: useColorModeValue('#f1f5f9', '#1a1d29'),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: useColorModeValue('#cbd5e0', '#35394a'),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: useColorModeValue('#a0aec0', '#3a3f4c'),
            },
          }}
        >
          <Table variant="simple" size="sm" style={{ tableLayout: 'fixed' }}>
            <Tbody>
              {currentRoles.map((role) => (
                <Tr key={role.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="120px" fontWeight="semibold" fontSize="xs" py={3}>
                    {role.id}
                  </Td>
                  <Td w="150px" fontSize="xs" py={3}>
                    {role.nombre}
                  </Td>
                  <Td w="200px" fontSize="xs" py={3}>
                    <Text noOfLines={2} title={role.descripcion}>
                      {role.descripcion}
                    </Text>
                  </Td>
                  <Td w="250px" py={3}>
                    <Box>
                      {role.modulos.slice(0, 3).map((modulo, index) => (
                        <Badge key={index} size="sm" colorScheme="blue" mr={1} mb={1}>
                          {modulo}
                        </Badge>
                      ))}
                      {role.modulos.length > 3 && (
                        <Badge size="sm" colorScheme="gray">
                          +{role.modulos.length - 3} más
                        </Badge>
                      )}
                    </Box>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3} textAlign="center">
                    <Badge size="sm" colorScheme="purple">
                      {role.usuarios.length}
                    </Badge>
                  </Td>
                  <Td w="100px" py={3}>
                    <Badge colorScheme={getEstadoColor(role.estado)} size="sm">
                      {role.estado}
                    </Badge>
                  </Td>
                  <Td w="150px" py={3}>
                    <HStack spacing={1}>
                      <IconButton
                        icon={<Eye size={12} />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        aria-label="Ver detalles"
                      />
                      <IconButton
                        icon={<Edit size={12} />}
                        size="xs"
                        colorScheme="green"
                        variant="ghost"
                        aria-label="Editar"
                        onClick={() => handleEditRole(role)}
                      />
                      <IconButton
                        icon={<UserPlus size={12} />}
                        size="xs"
                        colorScheme="purple"
                        variant="ghost"
                        aria-label="Asignar usuarios"
                        onClick={() => handleAssignUsers(role)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        </Box>
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Center mt={4}>
          <HStack spacing={2}>
            <IconButton
              icon={<ChevronLeft size={16} />}
              onClick={handlePrevPage}
              isDisabled={currentPage === 1}
              size="sm"
              variant="outline"
              colorScheme="blue"
              aria-label="Página anterior"
            />
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                size="sm"
                variant={currentPage === page ? "solid" : "outline"}
                colorScheme="blue"
                minW="40px"
              >
                {page}
              </Button>
            ))}
            
            <IconButton
              icon={<ChevronRight size={16} />}
              onClick={handleNextPage}
              isDisabled={currentPage === totalPages}
              size="sm"
              variant="outline"
              colorScheme="blue"
              aria-label="Página siguiente"
            />
          </HStack>
        </Center>
      )}

      {/* Pagination Info */}
      <Center mt={2}>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
          Mostrando {startIndex + 1}-{Math.min(endIndex, roles.length)} de {roles.length} roles
        </Text>
      </Center>

      {/* Create/Edit Role Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent bg={useColorModeValue('white', '#252a36')}>
          <ModalHeader>
            <HStack spacing={3}>
              <Box
                p={2}
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="lg"
              >
                <Settings size={20} color={useColorModeValue('#3182ce', '#63b3ed')} />
              </Box>
              <Text>{selectedRole ? 'Editar Rol' : 'Crear Nuevo Rol'}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Nombre del Rol</FormLabel>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Supervisor"
                      size="sm"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm">Estado</FormLabel>
                    <Select
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                      size="sm"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>
              
              <FormControl>
                <FormLabel fontSize="sm">Descripción</FormLabel>
                <Input
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Describe las responsabilidades del rol"
                  size="sm"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Módulos de Acceso</FormLabel>
                <CheckboxGroup
                  value={formData.modulos}
                  onChange={(values) => setFormData({...formData, modulos: values})}
                >
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {availableModules.map((modulo) => (
                      <GridItem key={modulo}>
                        <Checkbox value={modulo} size="sm">
                          {modulo}
                        </Checkbox>
                      </GridItem>
                    ))}
                  </Grid>
                </CheckboxGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
                leftIcon={<X size={16} />}
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSaveRole}
                leftIcon={<Save size={16} />}
                size="sm"
              >
                {selectedRole ? 'Actualizar' : 'Crear'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Assign Users Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent bg={useColorModeValue('white', '#252a36')}>
          <ModalHeader>
            <HStack spacing={3}>
              <Box
                p={2}
                bg={useColorModeValue('purple.50', 'purple.900')}
                borderRadius="lg"
              >
                <UserPlus size={20} color={useColorModeValue('#805ad5', '#b794f6')} />
              </Box>
              <Text>Asignar Usuarios al Rol: {selectedRole?.nombre}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                Selecciona los usuarios que tendrán este rol:
              </Text>
              
              {/* User Search Filter */}
              <Input
                placeholder="Buscar usuarios por nombre o email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                size="sm"
                bg={useColorModeValue('white', '#2a2f3a')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'transparent')}
                borderRadius="lg"
                _hover={{ 
                  borderColor: useColorModeValue('blue.300', 'primary.600')
                }}
                _focus={{ 
                  borderColor: useColorModeValue('blue.500', 'primary.500'),
                  boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none')
                }}
              />
              
              {/* Users Selection */}
              <Box
                maxH="300px"
                overflowY="auto"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                borderRadius="lg"
                p={3}
                css={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: useColorModeValue('#f1f5f9', '#1a1d29'),
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: useColorModeValue('#cbd5e0', '#35394a'),
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: useColorModeValue('#a0aec0', '#3a3f4c'),
                  },
                }}
              >
                {filteredUsers.length === 0 ? (
                  <Text 
                    fontSize="sm" 
                    color={useColorModeValue('gray.500', 'gray.400')} 
                    textAlign="center" 
                    py={4}
                  >
                    No se encontraron usuarios que coincidan con la búsqueda
                  </Text>
                ) : (
                  <CheckboxGroup
                    value={assignData.usuarios}
                    onChange={(values) => setAssignData({usuarios: values})}
                  >
                    <VStack spacing={3} align="stretch">
                      {filteredUsers.map((user) => (
                        <Box
                          key={user.email}
                          p={2}
                          borderRadius="md"
                          _hover={{
                            bg: useColorModeValue('gray.50', '#35394a')
                          }}
                          transition="background 0.2s"
                        >
                          <Checkbox value={user.email} size="sm">
                            <VStack spacing={0} align="start">
                              <Text fontSize="sm" fontWeight="medium">
                                {user.nombre}
                              </Text>
                              <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
                                {user.email}
                              </Text>
                            </VStack>
                          </Checkbox>
                        </Box>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                )}
              </Box>
              
              {/* Selection Summary */}
              <Box
                p={3}
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="lg"
                border="1px solid"
                borderColor={useColorModeValue('blue.200', 'blue.700')}
              >
                <Text fontSize="sm" color={useColorModeValue('blue.700', 'blue.300')}>
                  <strong>{assignData.usuarios.length}</strong> usuario(s) seleccionado(s)
                  {assignData.usuarios.length > 0 && (
                    <span> de {filteredUsers.length} mostrado(s)</span>
                  )}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={() => setIsAssignModalOpen(false)}
                leftIcon={<X size={16} />}
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleSaveAssignment}
                leftIcon={<UserPlus size={16} />}
                size="sm"
              >
                Asignar Usuarios
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// const RoleAssignmentSubModule = () => (
//   <Box p={6} h="100%" display="flex" alignItems="center" justifyContent="center">
//     <VStack spacing={4}>
//       <UserCheck size={48} color={useColorModeValue('#3182ce', '#63b3ed')} />
//       <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
//         Asignación de Roles
//       </Text>
//       <Text fontSize="md" color={useColorModeValue('gray.600', 'app.text.secondary')} textAlign="center">
//         Módulo en desarrollo...
//       </Text>
//     </VStack>
//   </Box>
// );

// const PermissionsConfigSubModule = () => (
//   <Box p={6} h="100%" display="flex" alignItems="center" justifyContent="center">
//     <VStack spacing={4}>
//       <Shield size={48} color={useColorModeValue('#3182ce', '#63b3ed')} />
//       <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
//         Configuración de Permisos
//       </Text>
//       <Text fontSize="md" color={useColorModeValue('gray.600', 'app.text.secondary')} textAlign="center">
//         Módulo en desarrollo...
//       </Text>
//     </VStack>
//   </Box>
// );

const GeneralConfigSubModule = () => (
  <Box p={6} h="100%" display="flex" alignItems="center" justifyContent="center">
    <VStack spacing={4}>
      <Sliders size={48} color={useColorModeValue('#3182ce', '#63b3ed')} />
      <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
        Configuración General
      </Text>
      <Text fontSize="md" color={useColorModeValue('gray.600', 'app.text.secondary')} textAlign="center">
        Módulo en desarrollo...
      </Text>
    </VStack>
  </Box>
);

// Main SystemManagementPage Component
const SystemManagementPage = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [activeSubModule, setActiveSubModule] = useState('roles'); // Default to roles

  const bgColor = useColorModeValue('app.bg.primary', 'app.bg.primary');
  const headerBg = useColorModeValue('app.surface.header', 'app.surface.header');
  const sidebarBg = useColorModeValue('white', '#252a36');

  const subModules = [
    {
      id: 'roles',
      name: 'Gestión de Roles',
      icon: Users,
      component: RoleManagementSubModule
    },
    // {
    //   id: 'assignment',
    //   name: 'Asignación de Roles',
    //   icon: UserCheck,
    //   component: RoleAssignmentSubModule
    // },
    // {
    //   id: 'permissions',
    //   name: 'Permisos',
    //   icon: Shield,
    //   component: PermissionsConfigSubModule
    // },
    {
      id: 'general',
      name: 'Configuración General',
      icon: Sliders,
      component: GeneralConfigSubModule
    }
  ];

  const renderActiveComponent = () => {
    const activeModule = subModules.find(module => module.id === activeSubModule);
    if (activeModule) {
      const Component = activeModule.component;
      return <Component />;
    }
    return null;
  };

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <Box minH="100vh" bg={bgColor}>
          {/* Header */}
          <Flex
            bg={headerBg}
            color="white"
            px={6}
            py={4}
            align="center"
            justify="space-between"
          >
            <HStack spacing={4}>
              <Button
                leftIcon={<Home size={16} />}
                onClick={() => navigate('/dashboard')}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-1px)'
                }}
                _active={{
                  transform: 'translateY(0px)'
                }}
                transition="all 0.2s"
              >
                Inicio
              </Button>
              <Text fontSize="xl" fontWeight="bold">
                ⚙️ Administración del Sistema
              </Text>
            </HStack>

            <HStack spacing={4}>
              {/* Theme Toggle Button */}
              <IconButton
                icon={colorMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                onClick={toggleColorMode}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                }}
                aria-label={colorMode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
              />
              
              <Menu>
                <MenuButton
                  as={Button}
                  leftIcon={<User size={16} />}
                  colorScheme="gray"
                  size="sm"
                  variant="solid"
                  rightIcon={<ChevronDown size={14} />}
                >
                  {user?.name || 'Usuario'}
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem onClick={logout}>
                      Cerrar Sesión
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </HStack>
          </Flex>

          {/* Main Content */}
          <Flex h="calc(100vh - 80px)" overflow="hidden">
            {/* Left Sidebar - System Sub-modules Navigation */}
            <Box
              w="280px"
              minW="280px"
              bg={sidebarBg}
              borderRight="1px"
              borderColor={useColorModeValue('gray.200', 'transparent')}
              p={5}
            >
              <Text fontSize="lg" fontWeight="600" color={useColorModeValue('gray.800', 'app.text.primary')} mb={6}>
                Módulos del Sistema
              </Text>

              <VStack spacing={3} align="stretch">
                {subModules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeSubModule === module.id;
                  
                  return (
                    <Button
                      key={module.id}
                      leftIcon={<Icon size={18} />}
                      variant={isActive ? "solid" : "ghost"}
                      colorScheme={isActive ? "blue" : "gray"}
                      justifyContent="flex-start"
                      size="md"
                      w="100%"
                      onClick={() => setActiveSubModule(module.id)}
                      _hover={{
                        bg: isActive ? 'blue.600' : useColorModeValue('gray.100', 'gray.600')
                      }}
                      transition="all 0.2s"
                    >
                      {module.name}
                    </Button>
                  );
                })}
              </VStack>
            </Box>

            {/* Main Content Area */}
            <Box 
              flex={1} 
              bg={useColorModeValue('gray.50', '#1a1d29')}
              overflow="hidden"
              w="calc(100% - 280px)"
            >
              {renderActiveComponent()}
            </Box>
          </Flex>
        </Box>
      </DndProvider>
    </ChakraProvider>
  );
};

export default SystemManagementPage;