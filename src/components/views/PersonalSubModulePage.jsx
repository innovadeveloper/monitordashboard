// src/components/PersonalSubModulePage.jsx
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
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
  HStack,
  Center,
} from '@chakra-ui/react';
import { Search, Eye, Edit, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for personal
const mockPersonal = [
  {
    id: "P001",
    nombre: "Juan Carlos Pérez",
    documento: "12345678",
    cargo: "Conductor",
    telefono: "+51 999 123 456",
    email: "juan.perez@empresa.com",
    estado: "Activo",
    fechaIngreso: "2023-01-15",
    licencia: "A-IIb",
    experiencia: "5 años"
  },
  {
    id: "P002",
    nombre: "María Elena González",
    documento: "23456789",
    cargo: "Conductora",
    telefono: "+51 999 234 567",
    email: "maria.gonzalez@empresa.com",
    estado: "Activo",
    fechaIngreso: "2023-03-20",
    licencia: "A-IIb",
    experiencia: "3 años"
  },
  {
    id: "P003",
    nombre: "Carlos Antonio López",
    documento: "34567890",
    cargo: "Conductor",
    telefono: "+51 999 345 678",
    email: "carlos.lopez@empresa.com",
    estado: "Vacaciones",
    fechaIngreso: "2022-08-10",
    licencia: "A-IIb",
    experiencia: "7 años"
  },
  {
    id: "P004",
    nombre: "Ana Patricia Torres",
    documento: "45678901",
    cargo: "Supervisora",
    telefono: "+51 999 456 789",
    email: "ana.torres@empresa.com",
    estado: "Activo",
    fechaIngreso: "2021-11-05",
    licencia: "A-I",
    experiencia: "10 años"
  },
  {
    id: "P005",
    nombre: "Roberto Silva Méndez",
    documento: "56789012",
    cargo: "Conductor",
    telefono: "+51 999 567 890",
    email: "roberto.silva@empresa.com",
    estado: "Inactivo",
    fechaIngreso: "2024-02-28",
    licencia: "A-IIb",
    experiencia: "2 años"
  },
  {
    id: "P006",
    nombre: "Laura Beatriz Ramírez",
    documento: "67890123",
    cargo: "Conductora",
    telefono: "+51 999 678 901",
    email: "laura.ramirez@empresa.com",
    estado: "Activo",
    fechaIngreso: "2023-06-12",
    licencia: "A-IIb",
    experiencia: "4 años"
  },
  {
    id: "P007",
    nombre: "Diego Alejandro Morales",
    documento: "78901234",
    cargo: "Conductor",
    telefono: "+51 999 789 012",
    email: "diego.morales@empresa.com",
    estado: "Activo",
    fechaIngreso: "2022-12-05",
    licencia: "A-IIb",
    experiencia: "6 años"
  },
  {
    id: "P008",
    nombre: "Carmen Rosa Vega",
    documento: "89012345",
    cargo: "Jefa de Operaciones",
    telefono: "+51 999 890 123",
    email: "carmen.vega@empresa.com",
    estado: "Activo",
    fechaIngreso: "2020-04-18",
    licencia: "A-I",
    experiencia: "12 años"
  },
  {
    id: "P009",
    nombre: "Fernando José Castillo",
    documento: "90123456",
    cargo: "Conductor",
    telefono: "+51 999 901 234",
    email: "fernando.castillo@empresa.com",
    estado: "Vacaciones",
    fechaIngreso: "2023-09-30",
    licencia: "A-IIb",
    experiencia: "3 años"
  },
  {
    id: "P010",
    nombre: "Patricia Luz Herrera",
    documento: "01234567",
    cargo: "Supervisora",
    telefono: "+51 999 012 345",
    email: "patricia.herrera@empresa.com",
    estado: "Activo",
    fechaIngreso: "2021-07-22",
    licencia: "A-I",
    experiencia: "8 años"
  },
  {
    id: "P011",
    nombre: "Andrés Mateo Delgado",
    documento: "11234567",
    cargo: "Conductor",
    telefono: "+51 999 112 345",
    email: "andres.delgado@empresa.com",
    estado: "Activo",
    fechaIngreso: "2024-01-08",
    licencia: "A-IIb",
    experiencia: "1 año"
  },
  {
    id: "P012",
    nombre: "Isabel María Jiménez",
    documento: "22345678",
    cargo: "Conductora",
    telefono: "+51 999 223 456",
    email: "isabel.jimenez@empresa.com",
    estado: "Inactivo",
    fechaIngreso: "2023-11-14",
    licencia: "A-IIb",
    experiencia: "2 años"
  },
  {
    id: "P013",
    nombre: "Ricardo Eduardo Vargas",
    documento: "33456789",
    cargo: "Mecánico",
    telefono: "+51 999 334 567",
    email: "ricardo.vargas@empresa.com",
    estado: "Activo",
    fechaIngreso: "2022-05-16",
    licencia: "N/A",
    experiencia: "9 años"
  },
  {
    id: "P014",
    nombre: "Mónica Esperanza Cruz",
    documento: "44567890",
    cargo: "Asistente Administrativa",
    telefono: "+51 999 445 678",
    email: "monica.cruz@empresa.com",
    estado: "Activo",
    fechaIngreso: "2023-04-03",
    licencia: "N/A",
    experiencia: "4 años"
  },
  {
    id: "P015",
    nombre: "Gabriel Antonio Mendoza",
    documento: "55678901",
    cargo: "Conductor",
    telefono: "+51 999 556 789",
    email: "gabriel.mendoza@empresa.com",
    estado: "Activo",
    fechaIngreso: "2023-08-27",
    licencia: "A-IIb",
    experiencia: "3 años"
  }
];

const PersonalSubModulePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPersonal, setFilteredPersonal] = useState(mockPersonal);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(filteredPersonal.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPersonal.slice(startIndex, endIndex);

  React.useEffect(() => {
    const filtered = mockPersonal.filter(person =>
      person.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.documento.includes(searchTerm) ||
      person.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersonal(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return 'green';
      case 'Vacaciones': return 'orange';
      case 'Inactivo': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Gestión de Personal
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Administre el personal de conductores y supervisores
          </Text>
        </Box>
        <Button
          leftIcon={<UserPlus size={16} />}
          colorScheme="blue"
          size="sm"
        >
          Nuevo Personal
        </Button>
      </Flex>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Buscar por nombre, documento o cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="sm"
          w="400px"
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

      {/* Table */}
      <Box 
        flex={1} 
        overflow="hidden" 
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
                <Th w="100px" fontSize="xs" py={3}>ID</Th>
                <Th w="200px" fontSize="xs" py={3}>Nombre Completo</Th>
                <Th w="120px" fontSize="xs" py={3}>Documento</Th>
                <Th w="120px" fontSize="xs" py={3}>Cargo</Th>
                <Th w="140px" fontSize="xs" py={3}>Teléfono</Th>
                <Th w="100px" fontSize="xs" py={3}>Estado</Th>
                <Th w="100px" fontSize="xs" py={3}>Licencia</Th>
                <Th w="100px" fontSize="xs" py={3}>Experiencia</Th>
                <Th w="100px" fontSize="xs" py={3}>Acciones</Th>
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
              {currentItems.map((person) => (
                <Tr key={person.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="100px" fontWeight="semibold" fontSize="xs" py={3}>
                    {person.id}
                  </Td>
                  <Td w="200px" fontSize="xs" py={3}>
                    {person.nombre}
                  </Td>
                  <Td w="120px" fontSize="xs" py={3}>
                    {person.documento}
                  </Td>
                  <Td w="120px" fontSize="xs" py={3}>
                    {person.cargo}
                  </Td>
                  <Td w="140px" fontSize="xs" py={3}>
                    {person.telefono}
                  </Td>
                  <Td w="100px" py={3}>
                    <Badge colorScheme={getEstadoColor(person.estado)} size="sm">
                      {person.estado}
                    </Badge>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {person.licencia}
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {person.experiencia}
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
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredPersonal.length)} de {filteredPersonal.length} elementos
        </Text>
      </Center>
    </Box>
  );
};

export default PersonalSubModulePage;