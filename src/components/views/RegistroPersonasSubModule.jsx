// src/components/RegistroPersonasSubModule.jsx
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
import { Search, Eye, Edit, UserPlus, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for personas
const mockPersonas = [
  {
    id: "PER-001",
    nombre: "Juan Carlos",
    apellidos: "Pérez González",
    documento: "12345678",
    tipoDocumento: "DNI",
    telefono: "+51 999 123 456",
    email: "juan.perez@email.com",
    direccion: "Av. Lima 123, San Miguel",
    fechaNacimiento: "1985-03-15",
    estado: "Activo",
    fechaRegistro: "2023-01-15",
    contactoEmergencia: "Ana Pérez - 999888777"
  },
  {
    id: "PER-002",
    nombre: "María Elena",
    apellidos: "González Torres",
    documento: "23456789",
    tipoDocumento: "DNI",
    telefono: "+51 999 234 567",
    email: "maria.gonzalez@email.com",
    direccion: "Jr. Los Olivos 456, Lince",
    fechaNacimiento: "1990-08-22",
    estado: "Activo",
    fechaRegistro: "2023-03-20",
    contactoEmergencia: "Pedro González - 999777666"
  },
  {
    id: "PER-003",
    nombre: "Carlos Antonio",
    apellidos: "López Mendoza",
    documento: "34567890",
    tipoDocumento: "DNI",
    telefono: "+51 999 345 678",
    email: "carlos.lopez@email.com",
    direccion: "Av. Brasil 789, Magdalena",
    fechaNacimiento: "1982-12-10",
    estado: "Inactivo",
    fechaRegistro: "2022-08-10",
    contactoEmergencia: "Rosa López - 999666555"
  },
  {
    id: "PER-004",
    nombre: "Ana Patricia",
    apellidos: "Torres Valdez",
    documento: "45678901",
    tipoDocumento: "DNI",
    telefono: "+51 999 456 789",
    email: "ana.torres@email.com",
    direccion: "Jr. Cusco 321, Cercado de Lima",
    fechaNacimiento: "1988-05-30",
    estado: "Activo",
    fechaRegistro: "2021-11-05",
    contactoEmergencia: "Miguel Torres - 999555444"
  },
  {
    id: "PER-005",
    nombre: "Roberto",
    apellidos: "Silva Méndez",
    documento: "56789012",
    tipoDocumento: "DNI",
    telefono: "+51 999 567 890",
    email: "roberto.silva@email.com",
    direccion: "Av. Colonial 654, Callao",
    fechaNacimiento: "1995-07-18",
    estado: "Activo",
    fechaRegistro: "2024-02-28",
    contactoEmergencia: "Carmen Silva - 999444333"
  },
  {
    id: "PER-006",
    nombre: "Lucía",
    apellidos: "Ramírez Castro",
    documento: "67890123",
    tipoDocumento: "DNI",
    telefono: "+51 999 678 901",
    email: "lucia.ramirez@email.com",
    direccion: "Av. Arequipa 987, San Isidro",
    fechaNacimiento: "1987-11-25",
    estado: "Activo",
    fechaRegistro: "2023-06-12",
    contactoEmergencia: "José Ramírez - 999333222"
  },
  {
    id: "PER-007",
    nombre: "Diego",
    apellidos: "Morales Herrera",
    documento: "78901234",
    tipoDocumento: "DNI",
    telefono: "+51 999 789 012",
    email: "diego.morales@email.com",
    direccion: "Jr. Tacna 147, Breña",
    fechaNacimiento: "1993-04-12",
    estado: "Activo",
    fechaRegistro: "2023-09-15",
    contactoEmergencia: "Elena Morales - 999222111"
  },
  {
    id: "PER-008",
    nombre: "Carmen",
    apellidos: "Vega Sánchez",
    documento: "89012345",
    tipoDocumento: "DNI",
    telefono: "+51 999 890 123",
    email: "carmen.vega@email.com",
    direccion: "Av. La Marina 852, San Miguel",
    fechaNacimiento: "1984-09-03",
    estado: "Activo",
    fechaRegistro: "2022-12-08",
    contactoEmergencia: "Luis Vega - 999111000"
  },
  {
    id: "PER-009",
    nombre: "Fernando",
    apellidos: "Castillo Ramos",
    documento: "90123456",
    tipoDocumento: "DNI",
    telefono: "+51 999 901 234",
    email: "fernando.castillo@email.com",
    direccion: "Jr. Huancayo 369, La Victoria",
    fechaNacimiento: "1991-12-28",
    estado: "Inactivo",
    fechaRegistro: "2023-05-22",
    contactoEmergencia: "Pilar Castillo - 999000888"
  },
  {
    id: "PER-010",
    nombre: "Patricia",
    apellidos: "Herrera Díaz",
    documento: "01234567",
    tipoDocumento: "DNI",
    telefono: "+51 999 012 345",
    email: "patricia.herrera@email.com",
    direccion: "Av. Venezuela 741, Cercado de Lima",
    fechaNacimiento: "1989-06-14",
    estado: "Activo",
    fechaRegistro: "2024-01-10",
    contactoEmergencia: "Mario Herrera - 998888777"
  },
  {
    id: "PER-011",
    nombre: "Andrés",
    apellidos: "Delgado Flores",
    documento: "11234567",
    tipoDocumento: "DNI",
    telefono: "+51 999 112 345",
    email: "andres.delgado@email.com",
    direccion: "Jr. Amazonas 258, Rímac",
    fechaNacimiento: "1986-10-07",
    estado: "Activo",
    fechaRegistro: "2023-08-18",
    contactoEmergencia: "Rosa Delgado - 998777666"
  },
  {
    id: "PER-012",
    nombre: "Isabel",
    apellidos: "Jiménez Vargas",
    documento: "22345678",
    tipoDocumento: "DNI",
    telefono: "+51 999 223 456",
    email: "isabel.jimenez@email.com",
    direccion: "Av. Universitaria 963, Los Olivos",
    fechaNacimiento: "1992-02-19",
    estado: "Activo",
    fechaRegistro: "2023-11-30",
    contactoEmergencia: "Carlos Jiménez - 998666555"
  }
];

const RegistroPersonasSubModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPersonas, setFilteredPersonas] = useState(mockPersonas);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(filteredPersonas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPersonas.slice(startIndex, endIndex);

  React.useEffect(() => {
    const filtered = mockPersonas.filter(persona =>
      persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.documento.includes(searchTerm) ||
      persona.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersonas(filtered);
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
      case 'Inactivo': return 'red';
      default: return 'gray';
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Registro de Personas
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Gestione la información personal de todos los empleados
          </Text>
        </Box>
        <Button
          leftIcon={<UserPlus size={16} />}
          colorScheme="blue"
          size="sm"
        >
          Nueva Persona
        </Button>
      </Flex>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Buscar por nombre, apellidos, documento o email..."
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

      {/* Table */}
      <Box 
        flex={1} 
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
          <Table variant="simple" size="sm" minW="1200px">
            <Thead 
              bg={useColorModeValue('gray.50', '#35394a')}
              position="sticky"
              top={0}
              zIndex={1}
            >
              <Tr>
                <Th w="100px" fontSize="xs" py={3}>ID</Th>
                <Th w="180px" fontSize="xs" py={3}>Nombre Completo</Th>
                <Th w="100px" fontSize="xs" py={3}>Documento</Th>
                <Th w="80px" fontSize="xs" py={3}>Edad</Th>
                <Th w="140px" fontSize="xs" py={3}>Teléfono</Th>
                <Th w="180px" fontSize="xs" py={3}>Email</Th>
                <Th w="200px" fontSize="xs" py={3}>Dirección</Th>
                <Th w="100px" fontSize="xs" py={3}>Estado</Th>
                <Th w="100px" fontSize="xs" py={3}>Fecha Registro</Th>
                <Th w="100px" fontSize="xs" py={3}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map((persona) => (
                <Tr key={persona.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="100px" fontWeight="semibold" fontSize="xs" py={3}>
                    {persona.id}
                  </Td>
                  <Td w="180px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Text fontWeight="semibold">{persona.nombre}</Text>
                      <Text color="gray.500" fontSize="10px">{persona.apellidos}</Text>
                    </VStack>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Text>{persona.documento}</Text>
                      <Text color="gray.500" fontSize="10px">{persona.tipoDocumento}</Text>
                    </VStack>
                  </Td>
                  <Td w="80px" fontSize="xs" py={3} textAlign="center">
                    {calcularEdad(persona.fechaNacimiento)} años
                  </Td>
                  <Td w="140px" fontSize="xs" py={3}>
                    <HStack spacing={1}>
                      <Phone size={10} />
                      <Text>{persona.telefono}</Text>
                    </HStack>
                  </Td>
                  <Td w="180px" fontSize="xs" py={3}>
                    <HStack spacing={1}>
                      <Mail size={10} />
                      <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={persona.email}>
                        {persona.email}
                      </Text>
                    </HStack>
                  </Td>
                  <Td w="200px" fontSize="xs" py={3}>
                    <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={persona.direccion}>
                      {persona.direccion}
                    </Text>
                  </Td>
                  <Td w="100px" py={3}>
                    <Badge colorScheme={getEstadoColor(persona.estado)} size="sm">
                      {persona.estado}
                    </Badge>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {persona.fechaRegistro}
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
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredPersonas.length)} de {filteredPersonas.length} elementos
        </Text>
      </Center>
    </Box>
  );
};

export default RegistroPersonasSubModule;