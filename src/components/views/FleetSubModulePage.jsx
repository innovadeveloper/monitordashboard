// src/components/FleetSubModulePage.jsx
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
} from '@chakra-ui/react';
import { Search, Eye, Edit, Plus } from 'lucide-react';

// Mock data for fleet
const mockFleet = [
  {
    id: "BUS-1565",
    placa: "ABC-123",
    marca: "Volvo",
    modelo: "7900 Hybrid",
    año: "2022",
    capacidad: "90 pasajeros",
    combustible: "Híbrido",
    estado: "Operativo",
    conductor: "Juan Pérez",
    kilometraje: "125,340 km",
    ultimoMantenimiento: "2024-12-15",
    proximoMantenimiento: "2025-03-15"
  },
  {
    id: "BUS-1357",
    placa: "DEF-456",
    marca: "Mercedes-Benz",
    modelo: "Citaro",
    año: "2021",
    capacidad: "85 pasajeros",
    combustible: "Diésel",
    estado: "Operativo",
    conductor: "María González",
    kilometraje: "89,750 km",
    ultimoMantenimiento: "2024-11-20",
    proximoMantenimiento: "2025-02-20"
  },
  {
    id: "BUS-2535",
    placa: "GHI-789",
    marca: "Scania",
    modelo: "Citywide",
    año: "2023",
    capacidad: "95 pasajeros",
    combustible: "Gas Natural",
    estado: "Mantenimiento",
    conductor: "Carlos López",
    kilometraje: "45,120 km",
    ultimoMantenimiento: "2024-12-28",
    proximoMantenimiento: "2025-01-15"
  },
  {
    id: "BUS-7943",
    placa: "JKL-012",
    marca: "Volvo",
    modelo: "7900 Electric",
    año: "2023",
    capacidad: "88 pasajeros",
    combustible: "Eléctrico",
    estado: "Operativo",
    conductor: "Ana Torres",
    kilometraje: "32,580 km",
    ultimoMantenimiento: "2024-10-05",
    proximoMantenimiento: "2025-01-05"
  },
  {
    id: "BUS-7054",
    placa: "MNO-345",
    marca: "Mercedes-Benz",
    modelo: "eCitaro",
    año: "2022",
    capacidad: "92 pasajeros",
    combustible: "Eléctrico",
    estado: "Fuera de Servicio",
    conductor: "Roberto Silva",
    kilometraje: "178,920 km",
    ultimoMantenimiento: "2024-08-12",
    proximoMantenimiento: "2025-01-20"
  }
];

const FleetSubModulePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFleet, setFilteredFleet] = useState(mockFleet);

  React.useEffect(() => {
    const filtered = mockFleet.filter(vehicle =>
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFleet(filtered);
  }, [searchTerm]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Operativo': return 'green';
      case 'Mantenimiento': return 'orange';
      case 'Fuera de Servicio': return 'red';
      default: return 'gray';
    }
  };

  const getCombustibleColor = (combustible) => {
    switch (combustible) {
      case 'Eléctrico': return 'green';
      case 'Híbrido': return 'blue';
      case 'Gas Natural': return 'teal';
      case 'Diésel': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Gestión de Flota
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Administre los vehículos de la flota de transporte
          </Text>
        </Box>
        <Button
          leftIcon={<Plus size={16} />}
          colorScheme="blue"
          size="sm"
        >
          Nuevo Vehículo
        </Button>
      </Flex>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Buscar por ID, placa, marca o modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="sm"
          w="400px"
          leftElement={<Search size={16} />}
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
                <Th w="100px" fontSize="xs" py={3}>ID Bus</Th>
                <Th w="100px" fontSize="xs" py={3}>Placa</Th>
                <Th w="140px" fontSize="xs" py={3}>Marca/Modelo</Th>
                <Th w="80px" fontSize="xs" py={3}>Año</Th>
                <Th w="100px" fontSize="xs" py={3}>Capacidad</Th>
                <Th w="100px" fontSize="xs" py={3}>Combustible</Th>
                <Th w="100px" fontSize="xs" py={3}>Estado</Th>
                <Th w="120px" fontSize="xs" py={3}>Conductor</Th>
                <Th w="100px" fontSize="xs" py={3}>Kilometraje</Th>
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
              {filteredFleet.map((vehicle) => (
                <Tr key={vehicle.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="100px" fontWeight="semibold" fontSize="xs" py={3}>
                    {vehicle.id}
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {vehicle.placa}
                  </Td>
                  <Td w="140px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Text>{vehicle.marca}</Text>
                      <Text color="gray.500" fontSize="10px">{vehicle.modelo}</Text>
                    </VStack>
                  </Td>
                  <Td w="80px" fontSize="xs" py={3}>
                    {vehicle.año}
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {vehicle.capacidad}
                  </Td>
                  <Td w="100px" py={3}>
                    <Badge colorScheme={getCombustibleColor(vehicle.combustible)} size="sm" fontSize="10px">
                      {vehicle.combustible}
                    </Badge>
                  </Td>
                  <Td w="100px" py={3}>
                    <Badge colorScheme={getEstadoColor(vehicle.estado)} size="sm" fontSize="10px">
                      {vehicle.estado}
                    </Badge>
                  </Td>
                  <Td w="120px" fontSize="xs" py={3}>
                    {vehicle.conductor}
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {vehicle.kilometraje}
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
    </Box>
  );
};

export default FleetSubModulePage;