import React, { useState } from 'react';
import {
  Box,
  Text,
  Input,
  VStack,
  HStack,
  Badge,
  Select,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Search, ChevronDown } from 'lucide-react';
import DraggableBusItem from './DraggableBusItem';

const busData = [
  {
    id: 'BUS-1565',
    driver: 'Juan Pérez',
    time: '08:34 AM',
    route: 'Ruta 1',
    terminal: 'Terminal Norte',
    status: 'active'
  },
  {
    id: 'BUS-1357',
    driver: 'María González',
    time: '08:22 AM',
    route: 'Ruta 2',
    terminal: 'Con retraso',
    status: 'warning'
  },
  {
    id: 'BUS-2535',
    driver: 'Carlos López',
    time: '08:15 AM',
    route: 'Ruta 3',
    terminal: 'Fuera de ruta',
    status: 'critical'
  },
  {
    id: 'BUS-7943',
    driver: 'Ana Torres',
    time: '08:18 AM',
    route: 'Ruta 1',
    terminal: 'En tiempo',
    status: 'active'
  },
  {
    id: 'BUS-7054',
    driver: 'Roberto Silva',
    time: '08:43 AM',
    route: 'Ruta 2',
    terminal: 'Velocidad alta',
    status: 'warning'
  },
];

const BusList = ({ onBusDrop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');

  const filteredBuses = busData.filter(bus => {
    const matchesSearch = bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bus.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoute = selectedRoute === '' || bus.route === selectedRoute;
    return matchesSearch && matchesRoute;
  });

  return (
    <Box h="full" p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            Unidades Activas
          </Text>
          <ChevronDown size={16} color="gray.500" />
        </HStack>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search size={16} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por placa o conductor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="gray.50"
            border="none"
            _focus={{ bg: 'white', boxShadow: 'sm' }}
          />
        </InputGroup>

        <Select
          placeholder="Todas las rutas"
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          bg="gray.50"
          border="none"
          _focus={{ bg: 'white', boxShadow: 'sm' }}
        >
          <option value="Ruta 1">Ruta 1</option>
          <option value="Ruta 2">Ruta 2</option>
          <option value="Ruta 3">Ruta 3</option>
        </Select>

        <VStack spacing={2} align="stretch" maxH="calc(100vh - 300px)" overflowY="auto">
          {filteredBuses.map((bus) => (
            <DraggableBusItem key={bus.id} bus={bus} />
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default BusList;