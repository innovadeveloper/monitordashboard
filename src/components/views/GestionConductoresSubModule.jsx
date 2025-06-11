// src/components/GestionConductoresSubModule.jsx
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { Search, Eye, Edit, UserPlus, Clock, Award, BookOpen, Car, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for conductores
const mockConductores = [
  {
    id: "CON-001",
    nombre: "Miguel Angel",
    apellidos: "Rodriguez Castro",
    documento: "12345678",
    telefono: "+51 999 123 456",
    email: "miguel.rodriguez@email.com",
    fechaIngreso: "2022-03-15",
    estado: "Activo",
    licencia: {
      numero: "A10-12345678",
      categoria: "A-IIb",
      fechaVencimiento: "2025-08-20",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-01-15", tipo: "Manejo Defensivo", puntaje: 92, estado: "Aprobado" },
      { fecha: "2023-08-10", tipo: "Conocimiento de Rutas", puntaje: 88, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-02-20", curso: "Primeros Auxilios", duracion: "8 horas", estado: "Completado" },
      { fecha: "2023-11-15", curso: "Atención al Cliente", duracion: "4 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Mañana",
      horaInicio: "06:00",
      horaFin: "14:00",
      diasTrabajo: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    }
  },
  {
    id: "CON-002", 
    nombre: "Carlos Eduardo",
    apellidos: "Mendoza Torres",
    documento: "23456789",
    telefono: "+51 999 234 567",
    email: "carlos.mendoza@email.com",
    fechaIngreso: "2021-07-20",
    estado: "Activo",
    licencia: {
      numero: "A10-23456789",
      categoria: "A-IIb",
      fechaVencimiento: "2024-12-10",
      estado: "Por Vencer"
    },
    evaluaciones: [
      { fecha: "2024-01-20", tipo: "Seguridad Vehicular", puntaje: 95, estado: "Aprobado" },
      { fecha: "2023-09-05", tipo: "Manejo Defensivo", puntaje: 90, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-01-10", curso: "Mecánica Básica", duracion: "12 horas", estado: "Completado" },
      { fecha: "2023-10-25", curso: "Manejo de Emergencias", duracion: "6 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Tarde",
      horaInicio: "14:00",
      horaFin: "22:00",
      diasTrabajo: ["Lun", "Mar", "Mié", "Jue", "Vie"]
    }
  },
  {
    id: "CON-003",
    nombre: "Roberto",
    apellidos: "Silva Paredes",
    documento: "34567890",
    telefono: "+51 999 345 678",
    email: "roberto.silva@email.com",
    fechaIngreso: "2023-01-10",
    estado: "Inactivo",
    licencia: {
      numero: "A10-34567890",
      categoria: "A-IIa",
      fechaVencimiento: "2023-05-15",
      estado: "Vencida"
    },
    evaluaciones: [
      { fecha: "2023-06-15", tipo: "Conocimiento de Rutas", puntaje: 75, estado: "Observado" },
      { fecha: "2023-03-20", tipo: "Manejo Defensivo", puntaje: 82, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2023-02-15", curso: "Inducción General", duracion: "16 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Noche",
      horaInicio: "22:00",
      horaFin: "06:00",
      diasTrabajo: ["Dom", "Lun", "Mar", "Mié", "Jue"]
    }
  },
  {
    id: "CON-004",
    nombre: "Ana Patricia",
    apellidos: "Flores Vega",
    documento: "45678901",
    telefono: "+51 999 456 789",
    email: "ana.flores@email.com",
    fechaIngreso: "2023-08-05",
    estado: "Activo",
    licencia: {
      numero: "A10-45678901",
      categoria: "A-IIb",
      fechaVencimiento: "2026-02-28",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-02-10", tipo: "Atención al Usuario", puntaje: 98, estado: "Excelente" },
      { fecha: "2023-12-15", tipo: "Manejo Defensivo", puntaje: 94, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-03-05", curso: "Liderazgo y Comunicación", duracion: "8 horas", estado: "En Progreso" },
      { fecha: "2023-09-20", curso: "Primeros Auxilios", duracion: "8 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Mañana",
      horaInicio: "05:30",
      horaFin: "13:30",
      diasTrabajo: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    }
  },
  {
    id: "CON-005",
    nombre: "José Luis",
    apellidos: "Gutierrez Ramos",
    documento: "56789012",
    telefono: "+51 999 567 890",
    email: "jose.gutierrez@email.com",
    fechaIngreso: "2022-11-30",
    estado: "Activo",
    licencia: {
      numero: "A10-56789012",
      categoria: "A-IIb",
      fechaVencimiento: "2025-03-10",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-01-25", tipo: "Seguridad Vehicular", puntaje: 87, estado: "Aprobado" },
      { fecha: "2023-07-18", tipo: "Conocimiento de Rutas", puntaje: 91, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-01-30", curso: "Manejo Ecológico", duracion: "6 horas", estado: "Completado" },
      { fecha: "2023-12-05", curso: "Atención al Cliente", duracion: "4 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Tarde",
      horaInicio: "13:30",
      horaFin: "21:30",
      diasTrabajo: ["Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    }
  },
  {
    id: "CON-006",
    nombre: "Eduardo",
    apellidos: "Ramirez Silva",
    documento: "67890123",
    telefono: "+51 999 678 901",
    email: "eduardo.ramirez@email.com",
    fechaIngreso: "2023-02-14",
    estado: "Activo",
    licencia: {
      numero: "A10-67890123",
      categoria: "A-IIa",
      fechaVencimiento: "2025-12-15",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-02-15", tipo: "Manejo Defensivo", puntaje: 89, estado: "Aprobado" },
      { fecha: "2023-10-22", tipo: "Atención al Usuario", puntaje: 93, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-01-18", curso: "Primeros Auxilios", duracion: "8 horas", estado: "Completado" },
      { fecha: "2023-09-30", curso: "Inducción General", duracion: "16 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Mañana",
      horaInicio: "06:30",
      horaFin: "14:30",
      diasTrabajo: ["Lun", "Mar", "Mié", "Jue", "Vie"]
    }
  },
  {
    id: "CON-007",
    nombre: "Laura",
    apellidos: "Morales Peña",
    documento: "78901234",
    telefono: "+51 999 789 012",
    email: "laura.morales@email.com",
    fechaIngreso: "2023-06-18",
    estado: "Activo",
    licencia: {
      numero: "A10-78901234",
      categoria: "A-IIb",
      fechaVencimiento: "2026-04-10",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-03-12", tipo: "Conocimiento de Rutas", puntaje: 96, estado: "Excelente" },
      { fecha: "2023-12-08", tipo: "Seguridad Vehicular", puntaje: 91, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-02-28", curso: "Atención al Cliente", duracion: "4 horas", estado: "Completado" },
      { fecha: "2023-08-14", curso: "Manejo Ecológico", duracion: "6 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Tarde",
      horaInicio: "14:30",
      horaFin: "22:30",
      diasTrabajo: ["Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    }
  },
  {
    id: "CON-008",
    nombre: "Fernando",
    apellidos: "Vargas López",
    documento: "89012345",
    telefono: "+51 999 890 123",
    email: "fernando.vargas@email.com",
    fechaIngreso: "2021-10-05",
    estado: "Inactivo",
    licencia: {
      numero: "A10-89012345",
      categoria: "A-IIb",
      fechaVencimiento: "2024-06-30",
      estado: "Por Vencer"
    },
    evaluaciones: [
      { fecha: "2023-11-20", tipo: "Manejo Defensivo", puntaje: 78, estado: "Observado" },
      { fecha: "2023-05-15", tipo: "Atención al Usuario", puntaje: 85, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2023-06-12", curso: "Mecánica Básica", duracion: "12 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Noche",
      horaInicio: "22:30",
      horaFin: "06:30",
      diasTrabajo: ["Lun", "Mar", "Mié", "Jue", "Vie"]
    }
  },
  {
    id: "CON-009",
    nombre: "Patricia",
    apellidos: "Delgado Castro",
    documento: "90123456",
    telefono: "+51 999 901 234",
    email: "patricia.delgado@email.com",
    fechaIngreso: "2023-09-12",
    estado: "Activo",
    licencia: {
      numero: "A10-90123456",
      categoria: "A-IIa",
      fechaVencimiento: "2026-08-25",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-02-28", tipo: "Seguridad Vehicular", puntaje: 94, estado: "Aprobado" },
      { fecha: "2023-12-20", tipo: "Conocimiento de Rutas", puntaje: 88, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-01-22", curso: "Liderazgo y Comunicación", duracion: "8 horas", estado: "En Progreso" },
      { fecha: "2023-10-18", curso: "Inducción General", duracion: "16 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Mañana",
      horaInicio: "05:45",
      horaFin: "13:45",
      diasTrabajo: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    }
  },
  {
    id: "CON-010",
    nombre: "Ricardo",
    apellidos: "Huamán Torres",
    documento: "01234567",
    telefono: "+51 999 012 345",
    email: "ricardo.huaman@email.com",
    fechaIngreso: "2022-08-20",
    estado: "Activo",
    licencia: {
      numero: "A10-01234567",
      categoria: "A-IIb",
      fechaVencimiento: "2025-11-18",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-01-30", tipo: "Atención al Usuario", puntaje: 92, estado: "Aprobado" },
      { fecha: "2023-09-25", tipo: "Manejo Defensivo", puntaje: 87, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-02-14", curso: "Primeros Auxilios", duracion: "8 horas", estado: "Completado" },
      { fecha: "2023-11-28", curso: "Manejo de Emergencias", duracion: "6 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Tarde",
      horaInicio: "13:00",
      horaFin: "21:00",
      diasTrabajo: ["Lun", "Mar", "Mié", "Jue", "Vie"]
    }
  },
  {
    id: "CON-011",
    nombre: "Carmen",
    apellidos: "Quispe Mamani",
    documento: "11234567",
    telefono: "+51 999 112 345",
    email: "carmen.quispe@email.com",
    fechaIngreso: "2023-04-22",
    estado: "Activo",
    licencia: {
      numero: "A10-11234567",
      categoria: "A-IIa",
      fechaVencimiento: "2026-01-30",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-03-18", tipo: "Conocimiento de Rutas", puntaje: 90, estado: "Aprobado" },
      { fecha: "2023-11-12", tipo: "Seguridad Vehicular", puntaje: 95, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-01-08", curso: "Atención al Cliente", duracion: "4 horas", estado: "Completado" },
      { fecha: "2023-07-15", curso: "Mecánica Básica", duracion: "12 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Mañana",
      horaInicio: "06:15",
      horaFin: "14:15",
      diasTrabajo: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    }
  },
  {
    id: "CON-012",
    nombre: "Manuel",
    apellidos: "Chávez Rojas",
    documento: "22234567",
    telefono: "+51 999 223 456",
    email: "manuel.chavez@email.com",
    fechaIngreso: "2021-12-08",
    estado: "Activo",
    licencia: {
      numero: "A10-22234567",
      categoria: "A-IIb",
      fechaVencimiento: "2025-09-22",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-02-05", tipo: "Manejo Defensivo", puntaje: 86, estado: "Aprobado" },
      { fecha: "2023-08-30", tipo: "Atención al Usuario", puntaje: 89, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-01-25", curso: "Manejo Ecológico", duracion: "6 horas", estado: "Completado" },
      { fecha: "2023-10-10", curso: "Manejo de Emergencias", duracion: "6 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Noche",
      horaInicio: "22:00",
      horaFin: "06:00",
      diasTrabajo: ["Dom", "Lun", "Mar", "Mié", "Jue"]
    }
  },
  {
    id: "CON-013",
    nombre: "Diana",
    apellidos: "Romero Espinoza",
    documento: "33234567",
    telefono: "+51 999 332 345",
    email: "diana.romero@email.com",
    fechaIngreso: "2023-11-15",
    estado: "Activo",
    licencia: {
      numero: "A10-33234567",
      categoria: "A-IIa",
      fechaVencimiento: "2026-07-12",
      estado: "Vigente"
    },
    evaluaciones: [
      { fecha: "2024-03-25", tipo: "Seguridad Vehicular", puntaje: 97, estado: "Excelente" },
      { fecha: "2024-01-08", tipo: "Conocimiento de Rutas", puntaje: 92, estado: "Aprobado" }
    ],
    capacitaciones: [
      { fecha: "2024-02-22", curso: "Liderazgo y Comunicación", duracion: "8 horas", estado: "En Progreso" },
      { fecha: "2023-12-18", curso: "Inducción General", duracion: "16 horas", estado: "Completado" }
    ],
    horarios: {
      turno: "Tarde",
      horaInicio: "14:00",
      horaFin: "22:00",
      diasTrabajo: ["Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    }
  }
];

const GestionConductoresSubModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConductores, setFilteredConductores] = useState(mockConductores);
  const [selectedConductor, setSelectedConductor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(filteredConductores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredConductores.slice(startIndex, endIndex);

  React.useEffect(() => {
    const filtered = mockConductores.filter(conductor =>
      conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.documento.includes(searchTerm) ||
      conductor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.licencia.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConductores(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return 'green';
      case 'Inactivo': return 'red';
      default: return 'gray';
    }
  };

  const getLicenciaEstadoColor = (estado) => {
    switch (estado) {
      case 'Vigente': return 'green';
      case 'Por Vencer': return 'orange';
      case 'Vencida': return 'red';
      default: return 'gray';
    }
  };

  const getEvaluacionColor = (estado) => {
    switch (estado) {
      case 'Excelente': return 'purple';
      case 'Aprobado': return 'green';
      case 'Observado': return 'orange';
      case 'Reprobado': return 'red';
      default: return 'gray';
    }
  };

  const getCapacitacionColor = (estado) => {
    switch (estado) {
      case 'Completado': return 'green';
      case 'En Progreso': return 'blue';
      case 'Pendiente': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Gestión de Conductores
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Licencias, horarios, evaluaciones y capacitaciones
          </Text>
        </Box>
        <Button
          leftIcon={<UserPlus size={16} />}
          colorScheme="blue"
          size="sm"
        >
          Nuevo Conductor
        </Button>
      </Flex>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Buscar por nombre, documento, email o licencia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="sm"
          w="500px"
          leftElement={<Search size={16} />}
          borderRadius="xl"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'transparent')}
          bg={useColorModeValue('white', '#2a2f3a')}
          color={useColorModeValue('gray.800', '#e2e8f0')}
          _placeholder={{ color: useColorModeValue('gray.500', '#718096') }}
          _hover={{ 
            borderColor: useColorModeValue('blue.300', 'primary.600'),
            bg: useColorModeValue('gray.50', '#2f3441')
          }}
          _focus={{ 
            borderColor: useColorModeValue('blue.500', 'primary.500'), 
            boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none'),
            bg: useColorModeValue('white', '#2f3441')
          }}
        />
        <Button
          leftIcon={<Search size={16} />}
          colorScheme="blue"
          variant="outline"
          size="sm"
        >
          Buscar
        </Button>
      </HStack>

      {/* Main Content */}
      <Flex flex={1} gap={6} overflow="hidden">
        {/* Conductores List */}
        <Box 
          w="60%" 
          overflow="hidden" 
          borderRadius="lg" 
          border="1px solid" 
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          bg={useColorModeValue('white', '#2f3441')}
        >
          {/* Table with horizontal scroll */}
          <Box 
            overflow="auto"
            h="100%"
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
            <Table variant="simple" size="sm" minW="900px">
              <Thead 
                bg={useColorModeValue('gray.50', '#35394a')}
                position="sticky"
                top={0}
                zIndex={1}
              >
                <Tr>
                  <Th w="100px" fontSize="xs" py={3}>ID</Th>
                  <Th w="180px" fontSize="xs" py={3}>Conductor</Th>
                  <Th w="120px" fontSize="xs" py={3}>Licencia</Th>
                  <Th w="100px" fontSize="xs" py={3}>Estado Lic.</Th>
                  <Th w="100px" fontSize="xs" py={3}>Estado</Th>
                  <Th w="100px" fontSize="xs" py={3}>Ingreso</Th>
                  <Th w="100px" fontSize="xs" py={3}>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.map((conductor) => (
                  <Tr 
                    key={conductor.id} 
                    _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}
                    cursor="pointer"
                    onClick={() => setSelectedConductor(conductor)}
                    bg={selectedConductor?.id === conductor.id ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                  >
                    <Td w="100px" fontWeight="semibold" fontSize="xs" py={3}>
                      {conductor.id}
                    </Td>
                    <Td w="180px" fontSize="xs" py={3}>
                      <HStack spacing={2}>
                        <Avatar size="sm" name={`${conductor.nombre} ${conductor.apellidos}`} />
                        <VStack spacing={0} align="start">
                          <Text fontWeight="semibold">{conductor.nombre}</Text>
                          <Text color="gray.500" fontSize="10px">{conductor.apellidos}</Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td w="120px" fontSize="xs" py={3}>
                      <VStack spacing={0} align="start">
                        <Text>{conductor.licencia.numero}</Text>
                        <Text color="gray.500" fontSize="10px">{conductor.licencia.categoria}</Text>
                      </VStack>
                    </Td>
                    <Td w="100px" py={3}>
                      <Badge colorScheme={getLicenciaEstadoColor(conductor.licencia.estado)} size="sm">
                        {conductor.licencia.estado}
                      </Badge>
                    </Td>
                    <Td w="100px" py={3}>
                      <Badge colorScheme={getEstadoColor(conductor.estado)} size="sm">
                        {conductor.estado}
                      </Badge>
                    </Td>
                    <Td w="100px" fontSize="xs" py={3}>
                      {conductor.fechaIngreso}
                    </Td>
                    <Td w="100px" py={3}>
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
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          
          {/* Pagination Controls */}
          {filteredConductores.length > itemsPerPage && (
            <Box 
              p={4} 
              borderTop="1px solid" 
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              bg={useColorModeValue('gray.50', '#35394a')}
            >
              <Flex justify="space-between" align="center">
                {/* Pagination Info */}
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredConductores.length)} de {filteredConductores.length} conductores
                </Text>
                
                {/* Pagination Buttons */}
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePrevPage}
                    isDisabled={currentPage === 1}
                    leftIcon={<ChevronLeft size={14} />}
                  >
                    Anterior
                  </Button>
                  
                  {/* Page Numbers */}
                  <HStack spacing={1}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? "solid" : "outline"}
                        colorScheme={currentPage === page ? "blue" : "gray"}
                        onClick={() => handlePageChange(page)}
                        minW="32px"
                      >
                        {page}
                      </Button>
                    ))}
                  </HStack>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNextPage}
                    isDisabled={currentPage === totalPages}
                    rightIcon={<ChevronRight size={14} />}
                  >
                    Siguiente
                  </Button>
                </HStack>
              </Flex>
            </Box>
          )}
        </Box>

        {/* Conductor Details */}
        <Box 
          w="40%" 
          bg={useColorModeValue('white', '#2f3441')}
          borderRadius="lg"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          p={4}
          overflow="hidden"
        >
          {selectedConductor ? (
            <VStack align="stretch" h="100%" spacing={4}>
              {/* Conductor Header */}
              <Flex align="center" gap={3} pb={3} borderBottom="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                <Avatar size="md" name={`${selectedConductor.nombre} ${selectedConductor.apellidos}`} />
                <Box>
                  <Text fontSize="lg" fontWeight="bold">
                    {selectedConductor.nombre} {selectedConductor.apellidos}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {selectedConductor.documento} • {selectedConductor.email}
                  </Text>
                </Box>
              </Flex>

              {/* Tabs for Details */}
              <Tabs size="sm" flex={1} display="flex" flexDirection="column">
                <TabList>
                  <Tab fontSize="xs"><Car size={14} style={{ marginRight: '4px' }} />Licencia</Tab>
                  <Tab fontSize="xs"><Clock size={14} style={{ marginRight: '4px' }} />Horarios</Tab>
                  <Tab fontSize="xs"><Award size={14} style={{ marginRight: '4px' }} />Evaluaciones</Tab>
                  <Tab fontSize="xs"><BookOpen size={14} style={{ marginRight: '4px' }} />Capacitaciones</Tab>
                </TabList>

                <TabPanels flex={1} overflow="hidden">
                  {/* Licencia Tab */}
                  <TabPanel p={3} h="100%">
                    <VStack align="stretch" spacing={3}>
                      <Box p={3} bg={useColorModeValue('gray.50', '#35394a')} borderRadius="md">
                        <Text fontSize="sm" fontWeight="semibold" mb={2}>Información de Licencia</Text>
                        <VStack align="stretch" spacing={2} fontSize="xs">
                          <HStack justify="space-between">
                            <Text color="gray.500">Número:</Text>
                            <Text>{selectedConductor.licencia.numero}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text color="gray.500">Categoría:</Text>
                            <Text>{selectedConductor.licencia.categoria}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text color="gray.500">Vencimiento:</Text>
                            <Text>{selectedConductor.licencia.fechaVencimiento}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text color="gray.500">Estado:</Text>
                            <Badge colorScheme={getLicenciaEstadoColor(selectedConductor.licencia.estado)} size="sm">
                              {selectedConductor.licencia.estado}
                            </Badge>
                          </HStack>
                        </VStack>
                      </Box>
                    </VStack>
                  </TabPanel>

                  {/* Horarios Tab */}
                  <TabPanel p={3} h="100%">
                    <VStack align="stretch" spacing={3}>
                      <Box p={3} bg={useColorModeValue('gray.50', '#35394a')} borderRadius="md">
                        <Text fontSize="sm" fontWeight="semibold" mb={2}>Horario de Trabajo</Text>
                        <VStack align="stretch" spacing={2} fontSize="xs">
                          <HStack justify="space-between">
                            <Text color="gray.500">Turno:</Text>
                            <Text>{selectedConductor.horarios.turno}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text color="gray.500">Hora Inicio:</Text>
                            <Text>{selectedConductor.horarios.horaInicio}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text color="gray.500">Hora Fin:</Text>
                            <Text>{selectedConductor.horarios.horaFin}</Text>
                          </HStack>
                          <VStack align="stretch" spacing={1}>
                            <Text color="gray.500">Días de Trabajo:</Text>
                            <Flex wrap="wrap" gap={1}>
                              {selectedConductor.horarios.diasTrabajo.map((dia) => (
                                <Badge key={dia} colorScheme="blue" size="sm">{dia}</Badge>
                              ))}
                            </Flex>
                          </VStack>
                        </VStack>
                      </Box>
                    </VStack>
                  </TabPanel>

                  {/* Evaluaciones Tab */}
                  <TabPanel p={0} h="100%" overflow="hidden">
                    <Box h="100%" overflow="auto">
                      <VStack align="stretch" spacing={2} p={3}>
                        {selectedConductor.evaluaciones.map((evaluacion, index) => (
                          <Box key={index} p={3} bg={useColorModeValue('gray.50', '#35394a')} borderRadius="md">
                            <VStack align="stretch" spacing={2} fontSize="xs">
                              <HStack justify="space-between">
                                <Text fontWeight="semibold">{evaluacion.tipo}</Text>
                                <Badge colorScheme={getEvaluacionColor(evaluacion.estado)} size="sm">
                                  {evaluacion.estado}
                                </Badge>
                              </HStack>
                              <HStack justify="space-between">
                                <Text color="gray.500">Fecha:</Text>
                                <Text>{evaluacion.fecha}</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text color="gray.500">Puntaje:</Text>
                                <Text fontWeight="semibold">{evaluacion.puntaje}/100</Text>
                              </HStack>
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  </TabPanel>

                  {/* Capacitaciones Tab */}
                  <TabPanel p={0} h="100%" overflow="hidden">
                    <Box h="100%" overflow="auto">
                      <VStack align="stretch" spacing={2} p={3}>
                        {selectedConductor.capacitaciones.map((capacitacion, index) => (
                          <Box key={index} p={3} bg={useColorModeValue('gray.50', '#35394a')} borderRadius="md">
                            <VStack align="stretch" spacing={2} fontSize="xs">
                              <HStack justify="space-between">
                                <Text fontWeight="semibold">{capacitacion.curso}</Text>
                                <Badge colorScheme={getCapacitacionColor(capacitacion.estado)} size="sm">
                                  {capacitacion.estado}
                                </Badge>
                              </HStack>
                              <HStack justify="space-between">
                                <Text color="gray.500">Fecha:</Text>
                                <Text>{capacitacion.fecha}</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text color="gray.500">Duración:</Text>
                                <Text>{capacitacion.duracion}</Text>
                              </HStack>
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          ) : (
            <Flex h="100%" align="center" justify="center">
              <VStack spacing={3}>
                <Car size={48} color={useColorModeValue('#CBD5E0', '#4A5568')} />
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  Selecciona un conductor de la lista para ver sus detalles
                </Text>
              </VStack>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default GestionConductoresSubModule;