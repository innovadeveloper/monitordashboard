// src/components/RouteSubModulePage.jsx
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
import { Search, Eye, Edit, Plus, MapPin } from 'lucide-react';

// Mock data for routes
const mockRoutes = [
  {
    id: "R001",
    nombre: "Ruta 1 - Centro Histórico",
    codigo: "RUT-001",
    origen: "Plaza de Armas",
    destino: "Terminal Norte",
    distancia: "18.5 km",
    tiempoEstimado: "45 min",
    paradas: 15,
    estado: "Activa",
    frecuencia: "15 min",
    tarifa: "S/ 2.50",
    vehiculosAsignados: 4,
    horaInicio: "05:30",
    horaFin: "23:00"
  },
  {
    id: "R002",
    nombre: "Ruta 2 - Zona Empresarial",
    codigo: "RUT-002",
    origen: "San Isidro",
    destino: "Miraflores",
    distancia: "12.3 km",
    tiempoEstimado: "30 min",
    paradas: 10,
    estado: "Activa",
    frecuencia: "20 min",
    tarifa: "S/ 3.00",
    vehiculosAsignados: 3,
    horaInicio: "06:00",
    horaFin: "22:30"
  },
  {
    id: "R003",
    nombre: "Ruta 3 - Conos Urbanos",
    codigo: "RUT-003",
    origen: "Villa El Salvador",
    destino: "Centro de Lima",
    distancia: "35.2 km",
    tiempoEstimado: "90 min",
    paradas: 25,
    estado: "Suspendida",
    frecuencia: "25 min",
    tarifa: "S/ 4.50",
    vehiculosAsignados: 6,
    horaInicio: "05:00",
    horaFin: "23:30"
  },
  {
    id: "R004",
    nombre: "Ruta 4 - Aeropuerto Express",
    codigo: "RUT-004",
    origen: "Jorge Chávez",
    destino: "San Borja",
    distancia: "22.8 km",
    tiempoEstimado: "35 min",
    paradas: 8,
    estado: "Activa",
    frecuencia: "30 min",
    tarifa: "S/ 8.00",
    vehiculosAsignados: 2,
    horaInicio: "04:30",
    horaFin: "24:00"
  },
  {
    id: "R005",
    nombre: "Ruta 5 - Circuito Universitario",
    codigo: "RUT-005",
    origen: "Universidad Mayor",
    destino: "Ciudad Universitaria",
    distancia: "15.7 km",
    tiempoEstimado: "40 min",
    paradas: 12,
    estado: "En Planificación",
    frecuencia: "18 min",
    tarifa: "S/ 2.00",
    vehiculosAsignados: 3,
    horaInicio: "06:30",
    horaFin: "21:00"
  }
];

const RouteSubModulePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState(mockRoutes);

  React.useEffect(() => {
    const filtered = mockRoutes.filter(route =>
      route.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destino.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
  }, [searchTerm]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activa': return 'green';
      case 'Suspendida': return 'red';
      case 'En Planificación': return 'orange';
      case 'Mantenimiento': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Gestión de Rutas
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Administre las rutas de transporte público urbano
          </Text>
        </Box>
        <Button
          leftIcon={<Plus size={16} />}
          colorScheme="blue"
          size="sm"
        >
          Nueva Ruta
        </Button>
      </Flex>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Buscar por nombre, código, origen o destino..."
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
                <Th w="100px" fontSize="xs" py={3}>Código</Th>
                <Th w="200px" fontSize="xs" py={3}>Nombre de Ruta</Th>
                <Th w="180px" fontSize="xs" py={3}>Origen - Destino</Th>
                <Th w="100px" fontSize="xs" py={3}>Distancia</Th>
                <Th w="100px" fontSize="xs" py={3}>Tiempo Est.</Th>
                <Th w="80px" fontSize="xs" py={3}>Paradas</Th>
                <Th w="100px" fontSize="xs" py={3}>Estado</Th>
                <Th w="100px" fontSize="xs" py={3}>Frecuencia</Th>
                <Th w="80px" fontSize="xs" py={3}>Tarifa</Th>
                <Th w="80px" fontSize="xs" py={3}>Vehículos</Th>
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
              {filteredRoutes.map((route) => (
                <Tr key={route.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="100px" fontWeight="semibold" fontSize="xs" py={3}>
                    {route.codigo}
                  </Td>
                  <Td w="200px" fontSize="xs" py={3}>
                    {route.nombre}
                  </Td>
                  <Td w="180px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Text>{route.origen}</Text>
                      <Text color="gray.500" fontSize="10px">→ {route.destino}</Text>
                    </VStack>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {route.distancia}
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {route.tiempoEstimado}
                  </Td>
                  <Td w="80px" fontSize="xs" py={3} textAlign="center">
                    {route.paradas}
                  </Td>
                  <Td w="100px" py={3}>
                    <Badge colorScheme={getEstadoColor(route.estado)} size="sm" fontSize="10px">
                      {route.estado}
                    </Badge>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    {route.frecuencia}
                  </Td>
                  <Td w="80px" fontSize="xs" py={3} textAlign="center" fontWeight="semibold">
                    {route.tarifa}
                  </Td>
                  <Td w="80px" fontSize="xs" py={3} textAlign="center">
                    <Badge colorScheme="blue" size="sm">
                      {route.vehiculosAsignados}
                    </Badge>
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
                        icon={<MapPin size={12} />}
                        size="xs"
                        colorScheme="green"
                        variant="ghost"
                        aria-label="Ver en mapa"
                      />
                      <IconButton
                        icon={<Edit size={12} />}
                        size="xs"
                        colorScheme="orange"
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

export default RouteSubModulePage;