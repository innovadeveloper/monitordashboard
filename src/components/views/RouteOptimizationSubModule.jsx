// src/components/RouteOptimizationSubModule.jsx
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
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
  Progress,
  Select,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
} from '@chakra-ui/react';
import { BarChart3, TrendingUp, Clock, MapPin, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock data for route optimization analysis
const mockOptimizationData = [
  {
    id: "OPT-001",
    ruta: "Ruta 01 - Centro",
    codigo: "R01",
    estado: "Optimizada",
    eficiencia: 92,
    tiempoActual: 45,
    tiempoOptimizado: 38,
    ahorro: 7,
    combustibleActual: 12.5,
    combustibleOptimizado: 9.8,
    satisfaccionUsuario: 88,
    congestionPromedio: 65,
    recomendaciones: [
      "Ajustar horarios pico",
      "Reducir 2 paradas intermedias",
      "Optimizar velocidad promedio"
    ],
    fechaAnalisis: "2024-03-15"
  },
  {
    id: "OPT-002",
    ruta: "Ruta 02 - Norte",
    codigo: "R02",
    estado: "Requiere Optimización",
    eficiencia: 76,
    tiempoActual: 65,
    tiempoOptimizado: 52,
    ahorro: 13,
    combustibleActual: 18.2,
    combustibleOptimizado: 14.6,
    satisfaccionUsuario: 72,
    congestionPromedio: 82,
    recomendaciones: [
      "Cambiar ruta por Av. Universitaria",
      "Aumentar frecuencia en horas pico",
      "Reducir tiempo de parada"
    ],
    fechaAnalisis: "2024-03-14"
  },
  {
    id: "OPT-003",
    ruta: "Ruta 03 - Sur",
    codigo: "R03",
    estado: "En Análisis",
    eficiencia: 85,
    tiempoActual: 75,
    tiempoOptimizado: 68,
    ahorro: 7,
    combustibleActual: 22.1,
    combustibleOptimizado: 19.8,
    satisfaccionUsuario: 81,
    congestionPromedio: 71,
    recomendaciones: [
      "Evaluar ruta alterna por Panamericana",
      "Optimizar ubicación de paradas",
      "Mejorar coordinación semafórica"
    ],
    fechaAnalisis: "2024-03-13"
  },
  {
    id: "OPT-004",
    ruta: "Ruta 04 - Este",
    codigo: "R04",
    estado: "Crítica",
    eficiencia: 58,
    tiempoActual: 55,
    tiempoOptimizado: 42,
    ahorro: 13,
    combustibleActual: 16.8,
    combustibleOptimizado: 12.9,
    satisfaccionUsuario: 65,
    congestionPromedio: 89,
    recomendaciones: [
      "Urgente: Cambio de ruta principal",
      "Implementar carril exclusivo",
      "Redistribuir horarios de salida"
    ],
    fechaAnalisis: "2024-03-12"
  }
];

const RouteOptimizationSubModule = () => {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [filteredData, setFilteredData] = useState(mockOptimizationData);

  React.useEffect(() => {
    if (selectedRoute) {
      const filtered = mockOptimizationData.filter(data => data.codigo === selectedRoute);
      setFilteredData(filtered);
    } else {
      setFilteredData(mockOptimizationData);
    }
  }, [selectedRoute]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Optimizada': return 'green';
      case 'En Análisis': return 'blue';
      case 'Requiere Optimización': return 'orange';
      case 'Crítica': return 'red';
      default: return 'gray';
    }
  };

  const getEficienciaColor = (eficiencia) => {
    if (eficiencia >= 85) return 'green';
    if (eficiencia >= 70) return 'orange';
    return 'red';
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Optimizada': return <CheckCircle size={16} />;
      case 'En Análisis': return <Clock size={16} />;
      case 'Requiere Optimización': return <TrendingUp size={16} />;
      case 'Crítica': return <AlertTriangle size={16} />;
      default: return <BarChart3 size={16} />;
    }
  };

  // Calculate summary statistics
  const promedioEficiencia = filteredData.reduce((sum, item) => sum + item.eficiencia, 0) / filteredData.length;
  const totalAhorro = filteredData.reduce((sum, item) => sum + item.ahorro, 0);
  const rutasOptimizadas = filteredData.filter(item => item.estado === 'Optimizada').length;

  return (
    <Box p={6} h="100%" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
            Optimización de Rutas
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'app.text.secondary')}>
            Análisis y mejora de eficiencia en recorridos
          </Text>
        </Box>
        <HStack spacing={3}>
          <Select
            placeholder="Filtrar por ruta"
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            size="sm"
            w="200px"
          >
            <option value="R01">R01 - Centro</option>
            <option value="R02">R02 - Norte</option>
            <option value="R03">R03 - Sur</option>
            <option value="R04">R04 - Este</option>
          </Select>
          <Button
            leftIcon={<Zap size={16} />}
            colorScheme="blue"
            size="sm"
          >
            Ejecutar Análisis
          </Button>
        </HStack>
      </Flex>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
        <Card size="sm">
          <CardBody>
            <Stat size="sm">
              <StatLabel fontSize="xs">Eficiencia Promedio</StatLabel>
              <StatNumber color={getEficienciaColor(promedioEficiencia)}>
                {promedioEficiencia.toFixed(1)}%
              </StatNumber>
              <StatHelpText fontSize="xs">
                <StatArrow type="increase" />
                +2.3% vs mes anterior
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card size="sm">
          <CardBody>
            <Stat size="sm">
              <StatLabel fontSize="xs">Ahorro Total</StatLabel>
              <StatNumber color="green.500">{totalAhorro} min</StatNumber>
              <StatHelpText fontSize="xs">
                Por viaje completo
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card size="sm">
          <CardBody>
            <Stat size="sm">
              <StatLabel fontSize="xs">Rutas Optimizadas</StatLabel>
              <StatNumber color="blue.500">{rutasOptimizadas}/{filteredData.length}</StatNumber>
              <StatHelpText fontSize="xs">
                {((rutasOptimizadas/filteredData.length)*100).toFixed(0)}% del total
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card size="sm">
          <CardBody>
            <Stat size="sm">
              <StatLabel fontSize="xs">Combustible Ahorrado</StatLabel>
              <StatNumber color="green.500">
                {filteredData.reduce((sum, item) => sum + (item.combustibleActual - item.combustibleOptimizado), 0).toFixed(1)}L
              </StatNumber>
              <StatHelpText fontSize="xs">
                Por día estimado
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

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
                <Th w="120px" fontSize="xs" py={3}>Ruta</Th>
                <Th w="120px" fontSize="xs" py={3}>Estado</Th>
                <Th w="100px" fontSize="xs" py={3}>Eficiencia</Th>
                <Th w="130px" fontSize="xs" py={3}>Tiempo (min)</Th>
                <Th w="130px" fontSize="xs" py={3}>Combustible (L)</Th>
                <Th w="100px" fontSize="xs" py={3}>Satisfacción</Th>
                <Th w="100px" fontSize="xs" py={3}>Congestión</Th>
                <Th w="250px" fontSize="xs" py={3}>Recomendaciones</Th>
                <Th w="100px" fontSize="xs" py={3}>Análisis</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((data) => (
                <Tr key={data.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                  <Td w="120px" py={3}>
                    <VStack spacing={0} align="start">
                      <Text fontWeight="bold" color="blue.600">{data.codigo}</Text>
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {data.ruta}
                      </Text>
                    </VStack>
                  </Td>
                  <Td w="120px" py={3}>
                    <HStack spacing={1}>
                      {getEstadoIcon(data.estado)}
                      <Badge colorScheme={getEstadoColor(data.estado)} size="sm">
                        {data.estado}
                      </Badge>
                    </HStack>
                  </Td>
                  <Td w="100px" py={3}>
                    <VStack spacing={1} align="center">
                      <Text fontWeight="bold" color={getEficienciaColor(data.eficiencia)}>
                        {data.eficiencia}%
                      </Text>
                      <Progress 
                        value={data.eficiencia} 
                        size="sm" 
                        colorScheme={getEficienciaColor(data.eficiencia)} 
                        w="80px"
                      />
                    </VStack>
                  </Td>
                  <Td w="130px" py={3}>
                    <VStack spacing={0} align="start">
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="gray.500">Actual:</Text>
                        <Text fontSize="xs">{data.tiempoActual}</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="green.500">Opt:</Text>
                        <Text fontSize="xs" color="green.600" fontWeight="semibold">
                          {data.tiempoOptimizado}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="blue.500">
                        Ahorro: {data.ahorro} min
                      </Text>
                    </VStack>
                  </Td>
                  <Td w="130px" py={3}>
                    <VStack spacing={0} align="start">
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="gray.500">Actual:</Text>
                        <Text fontSize="xs">{data.combustibleActual}</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="green.500">Opt:</Text>
                        <Text fontSize="xs" color="green.600" fontWeight="semibold">
                          {data.combustibleOptimizado}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="blue.500">
                        Ahorro: {(data.combustibleActual - data.combustibleOptimizado).toFixed(1)}L
                      </Text>
                    </VStack>
                  </Td>
                  <Td w="100px" py={3} textAlign="center">
                    <VStack spacing={1}>
                      <Text fontSize="sm" fontWeight="semibold">
                        {data.satisfaccionUsuario}%
                      </Text>
                      <Progress 
                        value={data.satisfaccionUsuario} 
                        size="sm" 
                        colorScheme={data.satisfaccionUsuario >= 80 ? 'green' : 'orange'} 
                        w="60px"
                      />
                    </VStack>
                  </Td>
                  <Td w="100px" py={3} textAlign="center">
                    <VStack spacing={1}>
                      <Text fontSize="sm" fontWeight="semibold" color={data.congestionPromedio >= 80 ? 'red.500' : 'orange.500'}>
                        {data.congestionPromedio}%
                      </Text>
                      <Progress 
                        value={data.congestionPromedio} 
                        size="sm" 
                        colorScheme={data.congestionPromedio >= 80 ? 'red' : 'orange'} 
                        w="60px"
                      />
                    </VStack>
                  </Td>
                  <Td w="250px" py={3}>
                    <VStack spacing={1} align="start">
                      {data.recomendaciones.slice(0, 2).map((rec, index) => (
                        <Text key={index} fontSize="xs" noOfLines={1} title={rec}>
                          • {rec}
                        </Text>
                      ))}
                      {data.recomendaciones.length > 2 && (
                        <Text fontSize="xs" color="blue.500">
                          +{data.recomendaciones.length - 2} más...
                        </Text>
                      )}
                    </VStack>
                  </Td>
                  <Td w="100px" py={3}>
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.500">
                        {data.fechaAnalisis}
                      </Text>
                      <IconButton
                        icon={<BarChart3 size={12} />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        aria-label="Ver análisis detallado"
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

export default RouteOptimizationSubModule;