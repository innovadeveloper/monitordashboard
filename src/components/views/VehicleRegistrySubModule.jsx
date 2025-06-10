// src/components/VehicleRegistrySubModule.jsx
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
  Avatar,
} from '@chakra-ui/react';
import { Search, Eye, Edit, Plus, Truck, Calendar, Settings } from 'lucide-react';

// Mock data for vehicles
const mockVehicles = [
  {
    id: "VEH-001",
    placa: "ABC-123",
    modelo: "Mercedes-Benz Sprinter",
    año: 2022,
    capacidad: 20,
    kilometraje: 45000,
    estado: "Activo",
    fechaAdquisicion: "2022-01-15",
    ultimoMantenimiento: "2024-02-20",
    proximoMantenimiento: "2024-05-20",
    seguro: {
      empresa: "Rimac Seguros",
      poliza: "POL-123456",
      vencimiento: "2024-12-31"
    },
    conductor: "Miguel Rodriguez",
    ruta: "Ruta 01 - Centro"
  },
  {
    id: "VEH-002",
    placa: "DEF-456",
    modelo: "Volvo B7R",
    año: 2021,
    capacidad: 45,
    kilometraje: 67000,
    estado: "Activo",
    fechaAdquisicion: "2021-08-10",
    ultimoMantenimiento: "2024-01-15",
    proximoMantenimiento: "2024-04-15",
    seguro: {
      empresa: "Pacifico Seguros",
      poliza: "POL-789012",
      vencimiento: "2024-11-30"
    },
    conductor: "Carlos Mendoza",
    ruta: "Ruta 02 - Norte"
  },
  {
    id: "VEH-003",
    placa: "GHI-789",
    modelo: "Scania K230",
    año: 2020,
    capacidad: 40,
    kilometraje: 89000,
    estado: "Mantenimiento",
    fechaAdquisicion: "2020-03-25",
    ultimoMantenimiento: "2024-03-01",
    proximoMantenimiento: "2024-06-01",
    seguro: {
      empresa: "La Positiva Seguros",
      poliza: "POL-345678",
      vencimiento: "2024-10-15"
    },
    conductor: "Sin Asignar",
    ruta: "Sin Asignar"
  },
  {
    id: "VEH-004",
    placa: "JKL-012",
    modelo: "Mercedes-Benz OH1628",
    año: 2023,
    capacidad: 35,
    kilometraje: 12000,
    estado: "Activo",
    fechaAdquisicion: "2023-06-10",
    ultimoMantenimiento: "2024-02-28",
    proximoMantenimiento: "2024-05-28",
    seguro: {
      empresa: "Mapfre Seguros",
      poliza: "POL-901234",
      vencimiento: "2025-01-15"
    },
    conductor: "Ana Flores",
    ruta: "Ruta 03 - Sur"
  },
  {
    id: "VEH-005",
    placa: "MNO-345",
    modelo: "Iveco Daily",
    año: 2019,
    capacidad: 16,
    kilometraje: 95000,
    estado: "Inactivo",
    fechaAdquisicion: "2019-11-20",
    ultimoMantenimiento: "2023-12-10",
    proximoMantenimiento: "2024-03-10",
    seguro: {
      empresa: "Rimac Seguros",
      poliza: "POL-567890",
      vencimiento: "2024-09-30"
    },
    conductor: "Sin Asignar",
    ruta: "Sin Asignar"
  },
  {
    id: "VEH-006",
    placa: "PQR-678",
    modelo: "Volvo B9R",
    año: 2022,
    capacidad: 50,
    kilometraje: 38000,
    estado: "Activo",
    fechaAdquisicion: "2022-09-15",
    ultimoMantenimiento: "2024-01-20",
    proximoMantenimiento: "2024-04-20",
    seguro: {
      empresa: "Pacifico Seguros",
      poliza: "POL-234567",
      vencimiento: "2024-12-20"
    },
    conductor: "José Gutierrez",
    ruta: "Ruta 04 - Este"
  }
];

const VehicleRegistrySubModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);

  React.useEffect(() => {
    const filtered = mockVehicles.filter(vehicle =>
      vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.ruta.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [searchTerm]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return 'green';
      case 'Inactivo': return 'red';
      case 'Mantenimiento': return 'orange';
      default: return 'gray';
    }
  };

  const getVehicleIcon = (modelo) => {
    if (modelo.toLowerCase().includes('sprinter') || modelo.toLowerCase().includes('daily')) {
      return '🚐';
    }
    return '🚌';
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Registro de Vehículos
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Gestione la información de todos los vehículos de la flota
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
          border="1px solid"
          borderRadius="10px"
          borderColor={useColorModeValue('gray.200', 'transparent')}
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
          placeholder="Buscar por placa, modelo, conductor o ruta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="sm"
          w="500px"
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
                <Th w="80px" fontSize="xs" py={3}>ID</Th>
                <Th w="140px" fontSize="xs" py={3}>Vehículo</Th>
                <Th w="90px" fontSize="xs" py={3}>Placa</Th>
                <Th w="60px" fontSize="xs" py={3}>Año</Th>
                <Th w="70px" fontSize="xs" py={3}>Cap.</Th>
                <Th w="80px" fontSize="xs" py={3}>Km</Th>
                <Th w="110px" fontSize="xs" py={3}>Conductor</Th>
                <Th w="100px" fontSize="xs" py={3}>Ruta</Th>
                <Th w="80px" fontSize="xs" py={3}>Estado</Th>
                <Th w="90px" fontSize="xs" py={3}>Próx. Mant.</Th>
                <Th w="80px" fontSize="xs" py={3}>Acciones</Th>
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
              {filteredVehicles.map((vehicle) => (
                <Tr key={vehicle.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="80px" fontWeight="semibold" fontSize="xs" py={3}>
                    {vehicle.id}
                  </Td>
                  <Td w="140px" fontSize="xs" py={3}>
                    <HStack spacing={2}>
                      <Text fontSize="lg">{getVehicleIcon(vehicle.modelo)}</Text>
                      <VStack spacing={0} align="start">
                        <Text fontWeight="semibold" fontSize="xs" noOfLines={1} title={vehicle.modelo}>{vehicle.modelo}</Text>
                        <Text color="gray.500" fontSize="10px">Año {vehicle.año}</Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td w="90px" fontSize="xs" py={3}>
                    <Text fontWeight="bold" color="blue.600">{vehicle.placa}</Text>
                  </Td>
                  <Td w="60px" fontSize="xs" py={3} textAlign="center">
                    {vehicle.año}
                  </Td>
                  <Td w="70px" fontSize="xs" py={3} textAlign="center">
                    {vehicle.capacidad}
                  </Td>
                  <Td w="80px" fontSize="xs" py={3} textAlign="center">
                    {(vehicle.kilometraje / 1000).toFixed(0)}k
                  </Td>
                  <Td w="110px" fontSize="xs" py={3}>
                    <Text
                      noOfLines={1}
                      color={vehicle.conductor === 'Sin Asignar' ? 'gray.500' : 'inherit'}
                      fontStyle={vehicle.conductor === 'Sin Asignar' ? 'italic' : 'normal'}
                      title={vehicle.conductor}
                    >
                      {vehicle.conductor}
                    </Text>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    <Text
                      noOfLines={1}
                      color={vehicle.ruta === 'Sin Asignar' ? 'gray.500' : 'inherit'}
                      fontStyle={vehicle.ruta === 'Sin Asignar' ? 'italic' : 'normal'}
                      title={vehicle.ruta}
                    >
                      {vehicle.ruta}
                    </Text>
                  </Td>
                  <Td w="80px" py={3}>
                    <Badge colorScheme={getEstadoColor(vehicle.estado)} size="sm">
                      {vehicle.estado}
                    </Badge>
                  </Td>
                  <Td w="90px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Calendar size={10} />
                      <Text fontSize="10px">{vehicle.proximoMantenimiento}</Text>
                    </VStack>
                  </Td>
                  <Td w="80px" py={3}>
                    <VStack spacing={1}>
                      <IconButton
                        icon={<Eye size={10} />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        aria-label="Ver detalles"
                      />
                      <HStack spacing={1}>
                        <IconButton
                          icon={<Edit size={10} />}
                          size="xs"
                          colorScheme="green"
                          variant="ghost"
                          aria-label="Editar"
                        />
                        <IconButton
                          icon={<Settings size={10} />}
                          size="xs"
                          colorScheme="orange"
                          variant="ghost"
                          aria-label="Mantenimiento"
                        />
                      </HStack>
                    </VStack>
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

export default VehicleRegistrySubModule;