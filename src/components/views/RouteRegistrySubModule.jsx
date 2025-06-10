// src/components/RouteRegistrySubModule.jsx
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
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Search, Eye, Edit, Plus, MapPin, Clock, Route } from 'lucide-react';

// Mock data for routes
const mockRoutes = [
  {
    id: "RUT-001",
    nombre: "Ruta 01 - Centro",
    codigo: "R01",
    origen: "Terminal San Isidro",
    destino: "Plaza de Armas",
    distancia: 15.2,
    tiempoEstimado: 45,
    estado: "Activa",
    vehiculosAsignados: 3,
    conductor: "Miguel Rodriguez",
    paradas: [
      "Terminal San Isidro",
      "Av. Javier Prado",
      "Av. Arequipa",
      "Av. Tacna",
      "Jr. Ucayali",
      "Plaza de Armas"
    ],
    horarios: {
      inicio: "05:00",
      fin: "23:00",
      frecuencia: "15 min"
    },
    tarifa: 2.50,
    fechaCreacion: "2023-01-15"
  },
  {
    id: "RUT-002",
    nombre: "Ruta 02 - Norte",
    codigo: "R02",
    origen: "Terminal Norte",
    destino: "Comas",
    distancia: 22.8,
    tiempoEstimado: 65,
    estado: "Activa",
    vehiculosAsignados: 5,
    conductor: "Carlos Mendoza",
    paradas: [
      "Terminal Norte",
      "Av. Túpac Amaru",
      "Independencia",
      "Los Olivos",
      "San Martín de Porres",
      "Comas Centro"
    ],
    horarios: {
      inicio: "04:30",
      fin: "23:30",
      frecuencia: "12 min"
    },
    tarifa: 3.00,
    fechaCreacion: "2023-02-20"
  },
  {
    id: "RUT-003",
    nombre: "Ruta 03 - Sur",
    codigo: "R03",
    origen: "Plaza San Martín",
    destino: "Villa El Salvador",
    distancia: 28.5,
    tiempoEstimado: 75,
    estado: "Activa",
    vehiculosAsignados: 4,
    conductor: "Ana Flores",
    paradas: [
      "Plaza San Martín",
      "Av. Grau",
      "Puente Nuevo",
      "Villa María del Triunfo",
      "San Juan de Miraflores",
      "Villa El Salvador"
    ],
    horarios: {
      inicio: "05:30",
      fin: "22:30",
      frecuencia: "18 min"
    },
    tarifa: 3.50,
    fechaCreacion: "2023-03-10"
  },
  {
    id: "RUT-004",
    nombre: "Ruta 04 - Este",
    codigo: "R04",
    origen: "Centro de Lima",
    destino: "Ate Vitarte",
    distancia: 18.7,
    tiempoEstimado: 55,
    estado: "En Mantenimiento",
    vehiculosAsignados: 2,
    conductor: "José Gutierrez",
    paradas: [
      "Centro de Lima",
      "Av. Abancay",
      "La Victoria",
      "San Luis",
      "Ate",
      "Vitarte Centro"
    ],
    horarios: {
      inicio: "06:00",
      fin: "22:00",
      frecuencia: "20 min"
    },
    tarifa: 2.80,
    fechaCreacion: "2023-04-05"
  },
  {
    id: "RUT-005",
    nombre: "Ruta Express - Aeropuerto",
    codigo: "REX",
    origen: "Miraflores",
    destino: "Aeropuerto Jorge Chávez",
    distancia: 12.3,
    tiempoEstimado: 35,
    estado: "Activa",
    vehiculosAsignados: 2,
    conductor: "Sin Asignar",
    paradas: [
      "Miraflores Centro",
      "San Isidro",
      "Av. Faucett",
      "Aeropuerto Terminal"
    ],
    horarios: {
      inicio: "04:00",
      fin: "24:00",
      frecuencia: "30 min"
    },
    tarifa: 8.00,
    fechaCreacion: "2023-05-15"
  }
];

const RouteRegistrySubModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState(mockRoutes);

  React.useEffect(() => {
    const filtered = mockRoutes.filter(route =>
      route.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.conductor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
  }, [searchTerm]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activa': return 'green';
      case 'Inactiva': return 'red';
      case 'En Mantenimiento': return 'orange';
      case 'Suspendida': return 'gray';
      default: return 'gray';
    }
  };

  const getRouteIcon = (codigo) => {
    if (codigo.includes('REX')) return '✈️';
    if (codigo.includes('R0')) return '🚌';
    return '🚐';
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Registro de Rutas
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Gestione todas las rutas de transporte público
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
          placeholder="Buscar por nombre, código, origen, destino o conductor..."
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
          <Table variant="simple" size="sm" minW="1360px">
            <Thead 
              bg={useColorModeValue('gray.50', '#35394a')}
              position="sticky"
              top={0}
              zIndex={1}
            >
              <Tr>
                <Th w="100px" fontSize="xs" py={3}>Código</Th>
                <Th w="200px" fontSize="xs" py={3}>Ruta</Th>
                <Th w="150px" fontSize="xs" py={3}>Origen</Th>
                <Th w="150px" fontSize="xs" py={3}>Destino</Th>
                <Th w="100px" fontSize="xs" py={3}>Distancia</Th>
                <Th w="100px" fontSize="xs" py={3}>Tiempo</Th>
                <Th w="140px" fontSize="xs" py={3}>Horarios</Th>
                <Th w="100px" fontSize="xs" py={3}>Tarifa</Th>
                <Th w="120px" fontSize="xs" py={3}>Conductor</Th>
                <Th w="100px" fontSize="xs" py={3}>Estado</Th>
                <Th w="100px" fontSize="xs" py={3}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredRoutes.map((route) => (
                <Tr key={route.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="100px" py={3}>
                    <HStack spacing={2}>
                      <Text fontSize="lg">{getRouteIcon(route.codigo)}</Text>
                      <VStack spacing={0} align="start">
                        <Text fontWeight="bold" color="blue.600">{route.codigo}</Text>
                        <Text fontSize="xs" color="gray.500">{route.id}</Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td w="200px" fontSize="xs" py={3}>
                    <Text fontWeight="semibold" noOfLines={1} title={route.nombre}>
                      {route.nombre}
                    </Text>
                    <Text fontSize="10px" color="gray.500">
                      {route.vehiculosAsignados} vehículos asignados
                    </Text>
                  </Td>
                  <Td w="150px" fontSize="xs" py={3}>
                    <HStack spacing={1}>
                      <MapPin size={10} color="green" />
                      <Text noOfLines={1} title={route.origen}>{route.origen}</Text>
                    </HStack>
                  </Td>
                  <Td w="150px" fontSize="xs" py={3}>
                    <HStack spacing={1}>
                      <MapPin size={10} color="red" />
                      <Text noOfLines={1} title={route.destino}>{route.destino}</Text>
                    </HStack>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3} textAlign="center">
                    <VStack spacing={0}>
                      <Text fontWeight="semibold">{route.distancia} km</Text>
                      <Text fontSize="10px" color="gray.500">{route.paradas.length} paradas</Text>
                    </VStack>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3} textAlign="center">
                    <HStack spacing={1}>
                      <Clock size={10} />
                      <Text>{route.tiempoEstimado} min</Text>
                    </HStack>
                  </Td>
                  <Td w="140px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Text>{route.horarios.inicio} - {route.horarios.fin}</Text>
                      <Text fontSize="10px" color="gray.500">c/ {route.horarios.frecuencia}</Text>
                    </VStack>
                  </Td>
                  <Td w="100px" fontSize="xs" py={3} textAlign="center">
                    <Text fontWeight="bold" color="green.600">
                      S/ {route.tarifa.toFixed(2)}
                    </Text>
                  </Td>
                  <Td w="120px" fontSize="xs" py={3}>
                    <Text 
                      noOfLines={1}
                      color={route.conductor === 'Sin Asignar' ? 'gray.500' : 'inherit'}
                      fontStyle={route.conductor === 'Sin Asignar' ? 'italic' : 'normal'}
                      title={route.conductor}
                    >
                      {route.conductor}
                    </Text>
                  </Td>
                  <Td w="100px" py={3}>
                    <Badge colorScheme={getEstadoColor(route.estado)} size="sm">
                      {route.estado}
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
                        icon={<Edit size={12} />}
                        size="xs"
                        colorScheme="green"
                        variant="ghost"
                        aria-label="Editar"
                      />
                      <IconButton
                        icon={<Route size={12} />}
                        size="xs"
                        colorScheme="purple"
                        variant="ghost"
                        aria-label="Ver en mapa"
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

export default RouteRegistrySubModule;