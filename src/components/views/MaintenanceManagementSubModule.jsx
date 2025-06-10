// src/components/MaintenanceManagementSubModule.jsx
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
  Select,
} from '@chakra-ui/react';
import { Search, Eye, Edit, Plus, Wrench, Calendar, AlertTriangle } from 'lucide-react';

// Mock data for maintenance records
const mockMaintenanceRecords = [
  {
    id: "MNT-001",
    vehiculo: "ABC-123",
    modelo: "Mercedes-Benz Sprinter",
    tipoMantenimiento: "Preventivo",
    descripcion: "Cambio de aceite y filtros",
    fechaProgramada: "2024-03-15",
    fechaRealizada: "2024-03-15",
    estado: "Completado",
    costo: 350.00,
    proveedor: "Taller Mecánico Central",
    proximoMantenimiento: "2024-06-15",
    observaciones: "Mantenimiento realizado según cronograma"
  },
  {
    id: "MNT-002",
    vehiculo: "DEF-456",
    modelo: "Volvo B7R",
    tipoMantenimiento: "Correctivo",
    descripcion: "Reparación sistema de frenos",
    fechaProgramada: "2024-03-20",
    fechaRealizada: "2024-03-22",
    estado: "Completado",
    costo: 1200.00,
    proveedor: "Servicio Volvo Lima",
    proximoMantenimiento: "2024-05-20",
    observaciones: "Se detectó desgaste excesivo en pastillas delanteras"
  },
  {
    id: "MNT-003",
    vehiculo: "GHI-789",
    modelo: "Scania K230",
    tipoMantenimiento: "Preventivo",
    descripcion: "Revisión general 20,000 km",
    fechaProgramada: "2024-04-10",
    fechaRealizada: null,
    estado: "Programado",
    costo: 800.00,
    proveedor: "Concesionario Scania",
    proximoMantenimiento: "2024-07-10",
    observaciones: "Mantenimiento mayor programado"
  },
  {
    id: "MNT-004",
    vehiculo: "JKL-012",
    modelo: "Mercedes-Benz OH1628",
    tipoMantenimiento: "Correctivo",
    descripcion: "Cambio de batería",
    fechaProgramada: "2024-03-25",
    fechaRealizada: null,
    estado: "En Proceso",
    costo: 450.00,
    proveedor: "Repuestos Mercedes Lima",
    proximoMantenimiento: "2024-06-25",
    observaciones: "Batería agotada, requiere reemplazo inmediato"
  },
  {
    id: "MNT-005",
    vehiculo: "PQR-678",
    modelo: "Volvo B9R",
    tipoMantenimiento: "Preventivo",
    descripcion: "Cambio de neumáticos",
    fechaProgramada: "2024-04-05",
    fechaRealizada: null,
    estado: "Pendiente",
    costo: 2800.00,
    proveedor: "Llantas del Norte",
    proximoMantenimiento: "2024-10-05",
    observaciones: "Cambio completo de 6 neumáticos"
  },
  {
    id: "MNT-006",
    vehiculo: "MNO-345",
    modelo: "Iveco Daily",
    tipoMantenimiento: "Correctivo",
    descripcion: "Reparación sistema eléctrico",
    fechaProgramada: "2024-02-28",
    fechaRealizada: "2024-03-02",
    estado: "Completado",
    costo: 680.00,
    proveedor: "Electro Service SAC",
    proximoMantenimiento: "2024-05-28",
    observaciones: "Falla en alternador, reparado exitosamente"
  }
];

const MaintenanceManagementSubModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState(mockMaintenanceRecords);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  React.useEffect(() => {
    let filtered = mockMaintenanceRecords;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(record => record.estado === statusFilter);
    }

    // Filter by type
    if (typeFilter) {
      filtered = filtered.filter(record => record.tipoMantenimiento === typeFilter);
    }

    setFilteredRecords(filtered);
  }, [searchTerm, statusFilter, typeFilter]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado': return 'green';
      case 'En Proceso': return 'blue';
      case 'Programado': return 'orange';
      case 'Pendiente': return 'yellow';
      case 'Cancelado': return 'red';
      default: return 'gray';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Preventivo': return 'blue';
      case 'Correctivo': return 'orange';
      case 'Emergencia': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityIcon = (estado, tipo) => {
    if (tipo === 'Correctivo' && estado === 'Pendiente') {
      return <AlertTriangle size={14} color="#E53E3E" />;
    }
    return <Wrench size={14} />;
  };

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Gestión de Mantenimiento
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Mantenimiento preventivo y correctivo de la flota
          </Text>
        </Box>
        <Button
          leftIcon={<Plus size={16} />}
          colorScheme="blue"
          size="sm"
        >
          Programar Mantenimiento
        </Button>
      </Flex>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Buscar por vehículo, modelo, descripción o proveedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="sm"
          w="400px"
          leftElement={<Search size={16} />}
        />
        <Select
          placeholder="Filtrar por estado"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="sm"
          w="150px"
        >
          <option value="Completado">Completado</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Programado">Programado</option>
          <option value="Pendiente">Pendiente</option>
        </Select>
        <Select
          placeholder="Filtrar por tipo"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          size="sm"
          w="150px"
        >
          <option value="Preventivo">Preventivo</option>
          <option value="Correctivo">Correctivo</option>
          <option value="Emergencia">Emergencia</option>
        </Select>
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
                <Th w="100px" fontSize="xs" py={3}>Vehículo</Th>
                <Th w="90px" fontSize="xs" py={3}>Tipo</Th>
                <Th w="150px" fontSize="xs" py={3}>Descripción</Th>
                <Th w="90px" fontSize="xs" py={3}>Prog.</Th>
                <Th w="90px" fontSize="xs" py={3}>Real.</Th>
                <Th w="80px" fontSize="xs" py={3}>Estado</Th>
                <Th w="70px" fontSize="xs" py={3}>Costo</Th>
                <Th w="120px" fontSize="xs" py={3}>Proveedor</Th>
                <Th w="80px" fontSize="xs" py={3}>Próx.</Th>
                <Th w="70px" fontSize="xs" py={3}>Acc.</Th>
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
              {filteredRecords.map((record) => (
                <Tr key={record.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="80px" fontWeight="semibold" fontSize="xs" py={3}>
                    {record.id}
                  </Td>
                  <Td w="100px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Text fontWeight="semibold" color="blue.600">{record.vehiculo}</Text>
                      <Text color="gray.500" fontSize="10px" noOfLines={1} title={record.modelo}>{record.modelo}</Text>
                    </VStack>
                  </Td>
                  <Td w="90px" py={3}>
                    <VStack spacing={1} align="start">
                      {getPriorityIcon(record.estado, record.tipoMantenimiento)}
                      <Badge colorScheme={getTipoColor(record.tipoMantenimiento)} size="sm">
                        {record.tipoMantenimiento === 'Preventivo' ? 'Prev.' : 'Corr.'}
                      </Badge>
                    </VStack>
                  </Td>
                  <Td w="150px" fontSize="xs" py={3}>
                    <Text noOfLines={2} title={record.descripcion}>
                      {record.descripcion}
                    </Text>
                  </Td>
                  <Td w="90px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Calendar size={10} />
                      <Text fontSize="10px">{record.fechaProgramada}</Text>
                    </VStack>
                  </Td>
                  <Td w="90px" fontSize="xs" py={3}>
                    {record.fechaRealizada ? (
                      <VStack spacing={0} align="start">
                        <Calendar size={10} />
                        <Text fontSize="10px">{record.fechaRealizada}</Text>
                      </VStack>
                    ) : (
                      <Text color="gray.500" fontStyle="italic" fontSize="10px">Pendiente</Text>
                    )}
                  </Td>
                  <Td w="80px" py={3}>
                    <Badge colorScheme={getEstadoColor(record.estado)} size="sm">
                      {record.estado === 'Completado' ? 'OK' : record.estado === 'En Proceso' ? 'Proc.' : record.estado}
                    </Badge>
                  </Td>
                  <Td w="70px" fontSize="xs" py={3} textAlign="center">
                    <Text fontWeight="semibold" fontSize="10px">
                      S/ {record.costo.toFixed(0)}
                    </Text>
                  </Td>
                  <Td w="120px" fontSize="xs" py={3}>
                    <Text noOfLines={2} title={record.proveedor} fontSize="10px">
                      {record.proveedor}
                    </Text>
                  </Td>
                  <Td w="80px" fontSize="xs" py={3}>
                    <VStack spacing={0} align="start">
                      <Calendar size={10} />
                      <Text fontSize="10px">{record.proximoMantenimiento}</Text>
                    </VStack>
                  </Td>
                  <Td w="70px" py={3}>
                    <VStack spacing={1}>
                      <IconButton
                        icon={<Eye size={10} />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        aria-label="Ver detalles"
                      />
                      <IconButton
                        icon={<Edit size={10} />}
                        size="xs"
                        colorScheme="green"
                        variant="ghost"
                        aria-label="Editar"
                      />
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

export default MaintenanceManagementSubModule;