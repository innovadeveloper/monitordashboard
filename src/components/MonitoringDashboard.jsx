// src/components/MonitoringDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Input,
  Select,
  Button,
  Badge,
  Grid,
  GridItem,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Bell, User, X, Play, Camera, ZoomIn, Square } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Mock Data
const mockBuses = [
  { id: "BUS-1565", conductor: "Juan Pérez", tiempo: "08:34 AM", ruta: "Ruta 1 → Terminal Norte", estado: "active", alertas: 0 },
  { id: "BUS-1357", conductor: "María González", tiempo: "08:22 AM", ruta: "Ruta 2 → Con retraso", estado: "warning", alertas: 1 },
  { id: "BUS-2535", conductor: "Carlos López", tiempo: "08:15 AM", ruta: "Ruta 3 → Fuera de ruta", estado: "error", alertas: 3 },
  { id: "BUS-7943", conductor: "Ana Torres", tiempo: "08:18 AM", ruta: "Ruta 1 → En tiempo", estado: "active", alertas: 0 },
  { id: "BUS-7054", conductor: "Roberto Silva", tiempo: "08:43 AM", ruta: "Ruta 2 → Velocidad alta", estado: "warning", alertas: 1 }
];

// BusItem Component with native drag & drop
const BusItem = ({ bus, isSelected, onClick, onDragStart }) => {
  const getStatusColor = (estado) => {
    switch(estado) {
      case 'active': return 'green.500';
      case 'warning': return 'orange.500';
      case 'error': return 'red.500';
      default: return 'green.500';
    }
  };

  return (
    <Box
      p={3}
      mb={2}
      bg={isSelected ? 'blue.50' : 'white'}
      border="1px"
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      borderRadius="md"
      cursor="grab"
      transition="all 0.2s"
      position="relative"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      _hover={{
        borderColor: 'blue.500',
        transform: 'translateY(-1px)',
        boxShadow: 'md'
      }}
      _active={{ cursor: 'grabbing' }}
    >
      <Box
        position="absolute"
        top={3}
        right={3}
        w={2.5}
        h={2.5}
        bg={getStatusColor(bus.estado)}
        borderRadius="full"
      />
      
      <Text fontWeight="600" color="gray.800" mb={1}>
        {bus.id}
      </Text>
      <Text fontSize="xs" color="gray.600" mb={1}>
        {bus.conductor} • {bus.tiempo}
      </Text>
      <Text fontSize="xs" color="gray.500">
        {bus.ruta}
      </Text>
      
      {bus.alertas > 0 && (
        <Badge
          position="absolute"
          top={1}
          right={7}
          colorScheme="red"
          fontSize="9px"
          borderRadius="full"
        >
          {bus.alertas}
        </Badge>
      )}
    </Box>
  );
};

// CameraPanel Component
const CameraPanel = ({ panel, onDrop, onClose, onDoubleClick }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    onDrop(panel.id);
  };

  return (
    <Box
      position="relative"
      h="100%"
      minH="200px"
      bg={panel.status === 'empty' ? 'gray.100' : 'gray.700'}
      borderRadius="md"
      border={dragOver ? '3px dashed' : '2px solid'}
      borderColor={dragOver ? 'blue.500' : panel.status === 'empty' ? 'gray.300' : 'gray.600'}
      overflow="hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={() => onDoubleClick(panel.id)}
      cursor={panel.status === 'empty' ? 'pointer' : 'default'}
      transition="all 0.2s"
      _hover={panel.status === 'empty' ? { borderColor: 'blue.400' } : {}}
    >
      {panel.status === 'empty' ? (
        <Flex
          h="100%"
          align="center"
          justify="center"
          direction="column"
          color="gray.500"
        >
          <Camera size={40} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <Text fontSize="sm">Arrastra un bus aquí</Text>
        </Flex>
      ) : (
        <>
          {/* Camera Overlay */}
          <Flex
            position="absolute"
            top={3}
            left={3}
            right={3}
            justify="space-between"
            align="center"
            zIndex={10}
          >
            <Text
              bg="blackAlpha.700"
              color="white"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {panel.cameraType?.toUpperCase()}
            </Text>
            <Badge colorScheme="green" fontSize="9px">
              VIVO
            </Badge>
          </Flex>

          {/* Bus Info */}
          <Flex
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            direction="column"
            align="center"
            color="white"
            textAlign="center"
          >
            <Camera size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <Text fontWeight="600" mb={1}>
              {panel.bus?.id}
            </Text>
            <Text fontSize="sm" opacity={0.8}>
              {panel.bus?.conductor}
            </Text>
          </Flex>

          {/* Camera Controls */}
          <HStack
            position="absolute"
            bottom={3}
            right={3}
            spacing={2}
            zIndex={10}
          >
            <IconButton
              aria-label="Record"
              icon={<Square size={16} />}
              size="sm"
              colorScheme="red"
              borderRadius="full"
              bg="blackAlpha.700"
              color="white"
              _hover={{ bg: 'blackAlpha.800' }}
            />
            <IconButton
              aria-label="Capture"
              icon={<Camera size={16} />}
              size="sm"
              borderRadius="full"
              bg="blackAlpha.700"
              color="white"
              _hover={{ bg: 'blackAlpha.800' }}
            />
            <IconButton
              aria-label="Zoom"
              icon={<ZoomIn size={16} />}
              size="sm"
              borderRadius="full"
              bg="blackAlpha.700"
              color="white"
              _hover={{ bg: 'blackAlpha.800' }}
            />
            <IconButton
              aria-label="Close"
              icon={<X size={16} />}
              size="sm"
              borderRadius="full"
              bg="blackAlpha.700"
              color="white"
              _hover={{ bg: 'blackAlpha.800' }}
              onClick={() => onClose(panel.id)}
            />
          </HStack>
        </>
      )}
    </Box>
  );
};

// Camera Selection Modal
const CameraSelectionModal = ({ isOpen, onClose, bus, onCameraSelect }) => {
  const cameraOptions = [
    { type: 'frontal', label: 'Cámara Frontal', description: 'Vista frontal del vehículo', icon: '📹' },
    { type: 'interior', label: 'Cámara Interior', description: 'Vista interior del bus', icon: '📷' },
    { type: 'lateral', label: 'Cámara Lateral', description: 'Vista lateral del vehículo', icon: '📹' },
    { type: 'dashboard', label: 'Cámara Dashboard', description: 'Vista del tablero', icon: '🖥️' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Seleccionar Cámara</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {bus && (
            <VStack spacing={4}>
              <Text fontSize="lg" fontWeight="600" color="blue.600">
                {bus.id} - {bus.conductor}
              </Text>
              
              <Grid templateColumns="1fr 1fr" gap={4} w="100%">
                {cameraOptions.map((camera) => (
                  <Box
                    key={camera.type}
                    p={4}
                    border="2px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    cursor="pointer"
                    textAlign="center"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'blue.500',
                      bg: 'blue.50'
                    }}
                    onClick={() => onCameraSelect(camera.type)}
                  >
                    <Text fontSize="2xl" mb={2}>{camera.icon}</Text>
                    <Text fontWeight="600" mb={1}>{camera.label}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {camera.description}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Main Dashboard Component
const MonitoringDashboard = () => {
  const [buses] = useState(mockBuses);
  const [filteredBuses, setFilteredBuses] = useState(mockBuses);
  const [selectedBuses, setSelectedBuses] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [draggedBus, setDraggedBus] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  
  const [videoPanels, setVideoPanels] = useState([
    { id: 1, bus: null, cameraType: null, status: 'empty' },
    { id: 2, bus: null, cameraType: null, status: 'empty' },
    { id: 3, bus: null, cameraType: null, status: 'empty' },
    { id: 4, bus: null, cameraType: null, status: 'empty' }
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('gray.800', 'gray.800');

  // Filter buses
  useEffect(() => {
    let filtered = buses;
    
    if (searchTerm) {
      filtered = filtered.filter(bus => 
        bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.conductor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (routeFilter !== 'all') {
      filtered = filtered.filter(bus => 
        bus.ruta.toLowerCase().includes(routeFilter.toLowerCase())
      );
    }
    
    setFilteredBuses(filtered);
  }, [searchTerm, routeFilter, buses]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= 'F1' && e.key <= 'F4') {
        e.preventDefault();
        const panelId = parseInt(e.key.slice(1));
        setSelectedPanel(panelId);
        toast({
          title: `Panel ${panelId} seleccionado`,
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toast]);

  const handleBusClick = (busId) => {
    setSelectedBuses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(busId)) {
        newSet.delete(busId);
      } else {
        newSet.add(busId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e, bus) => {
    setDraggedBus(bus);
    e.dataTransfer.setData('application/json', JSON.stringify(bus));
  };

  const handlePanelDrop = (panelId) => {
    if (draggedBus) {
      setSelectedPanel(panelId);
      onOpen();
    }
  };

  const handleCameraSelect = (cameraType) => {
    if (draggedBus && selectedPanel) {
      setVideoPanels(prev => prev.map(panel => 
        panel.id === selectedPanel 
          ? { ...panel, bus: draggedBus, cameraType, status: 'active' }
          : panel
      ));
      
      toast({
        title: `Cámara ${cameraType} conectada`,
        description: `${draggedBus.id} - ${draggedBus.conductor}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setDraggedBus(null);
      setSelectedPanel(null);
      onClose();
    }
  };

  const handlePanelClose = (panelId) => {
    setVideoPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, bus: null, cameraType: null, status: 'empty' }
        : panel
    ));
    
    toast({
      title: 'Cámara desconectada',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handlePanelDoubleClick = (panelId) => {
    toast({
      title: 'Selector rápido de bus',
      description: 'Funcionalidad por implementar',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box minH="100vh" bg={bgColor}>
        {/* Header */}
        <Flex
          bg={headerBg}
          color="white"
          px={6}
          py={4}
          align="center"
          justify="space-between"
        >
          <HStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              🚌 Monitoreo GPS y Flota
            </Text>
          </HStack>
          
          <HStack spacing={4}>
            <Button
              leftIcon={<Bell size={16} />}
              colorScheme="red"
              size="sm"
              variant="solid"
            >
              Centro de Alertas
            </Button>
            <Button
              leftIcon={<User size={16} />}
              colorScheme="gray"
              size="sm"
              variant="solid"
            >
              AC
            </Button>
          </HStack>
        </Flex>

        {/* Status Bar */}
        <Flex bg="white" px={6} py={3} borderBottom="1px" borderColor="gray.200">
          <HStack spacing={8}>
            <HStack>
              <Box w={3} h={3} bg="red.500" borderRadius="full" />
              <Text fontSize="sm" color="gray.600">3 Alertas Críticas</Text>
            </HStack>
            <HStack>
              <Box w={3} h={3} bg="orange.500" borderRadius="full" />
              <Text fontSize="sm" color="gray.600">7 Advertencias</Text>
            </HStack>
            <HStack>
              <Box w={3} h={3} bg="green.500" borderRadius="full" />
              <Text fontSize="sm" color="gray.600">85 Unidades Activas</Text>
            </HStack>
            <HStack>
              <Box w={3} h={3} bg="orange.500" borderRadius="full" />
              <Text fontSize="sm" color="gray.600">5 Con Retraso</Text>
            </HStack>
          </HStack>
        </Flex>

        {/* Main Content */}
        <Flex h="calc(100vh - 120px)">
          {/* Left Sidebar - Bus List */}
          <Box w="320px" bg="white" borderRight="1px" borderColor="gray.200" p={5}>
            <Text fontSize="lg" fontWeight="600" mb={4}>
              Unidades Activas
            </Text>
            
            <VStack spacing={3} mb={4}>
              <Input 
                placeholder="Buscar por placa o conductor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="sm"
              />
              <Select 
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                size="sm"
              >
                <option value="all">Todas las rutas</option>
                <option value="ruta 1">Ruta 1 - Centro</option>
                <option value="ruta 2">Ruta 2 - Norte</option>
                <option value="ruta 3">Ruta 3 - Sur</option>
              </Select>
            </VStack>

            <Box maxH="500px" overflowY="auto">
              {filteredBuses.map(bus => (
                <BusItem
                  key={bus.id}
                  bus={bus}
                  isSelected={selectedBuses.has(bus.id)}
                  onClick={() => handleBusClick(bus.id)}
                  onDragStart={(e) => handleDragStart(e, bus)}
                />
              ))}
            </Box>
          </Box>

          {/* Center - Video Grid */}
          <Flex flex={1} direction="column" bg="white" p={5}>
            <HStack mb={4} spacing={4}>
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<span>🗺️</span>}
              >
                Mapa Central
              </Button>
              <Button 
                variant="solid" 
                colorScheme="blue" 
                size="sm"
                leftIcon={<span>📹</span>}
              >
                Video Digital
              </Button>
            </HStack>

            <Grid 
              templateColumns="1fr 1fr" 
              templateRows="1fr 1fr" 
              gap={4} 
              h="100%"
            >
              {videoPanels.map(panel => (
                <GridItem key={panel.id}>
                  <CameraPanel
                    panel={panel}
                    onDrop={handlePanelDrop}
                    onClose={handlePanelClose}
                    onDoubleClick={handlePanelDoubleClick}
                  />
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </Flex>

        {/* Camera Selection Modal */}
        <CameraSelectionModal
          isOpen={isOpen}
          onClose={onClose}
          bus={draggedBus}
          onCameraSelect={handleCameraSelect}
        />
      </Box>
    </DndProvider>
  );
};

export default MonitoringDashboard;