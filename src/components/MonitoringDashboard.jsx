// src/components/MonitoringDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Input,
  Button,
  // Badge,
  Grid,
  GridItem,
  // IconButton,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Divider,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { Bell, User, X, Play, Camera, ZoomIn, Square, ChevronDown, Pause, MapPin, Route, Navigation, ChevronLeft, ChevronRight, Phone, MessageCircle, ImageIcon, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 1. IMPORTS - Agregar al inicio del archivo
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import ViewModeSelector from './ViewModeSelector';

// 1. Importar los nuevos componentes
import ContextMenu from './ContextMenu';
import EnhancedCameraPanel from './EnhancedCameraPanel';
import MaterialRouteSelector from './MaterialRouteSelector';
import BusItem from './BusItem';
import CameraSelectionModal from './CameraSelectionModal';
import LeafletMap from './LeafletMap';
import { useContextMenu } from '../hooks/useContextMenu';
import { useAuth } from '../contexts/AuthContext';


const mockBuses = [
  {
    id: "BUS-1565",
    conductor: "Juan Pérez",
    tiempo: "08:34 AM",
    ruta: "Ruta 1 → Terminal Norte",
    estado: "active",
    alertas: 0,
    velocidad: "45 km/h",
    telefono: "+51 999 123 456",
    fotos: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop"
    ]
  },
  {
    id: "BUS-1357",
    conductor: "María González",
    tiempo: "08:22 AM",
    ruta: "Ruta 2 → Con retraso",
    estado: "warning",
    alertas: 1,
    velocidad: "38 km/h",
    telefono: "+51 999 234 567",
    fotos: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
    ]
  },
  {
    id: "BUS-2535",
    conductor: "Carlos López",
    tiempo: "08:15 AM",
    ruta: "Ruta 3 → Fuera de ruta",
    estado: "error",
    alertas: 3,
    velocidad: "0 km/h",
    telefono: "+51 999 345 678",
    fotos: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=300&h=200&fit=crop"
    ]
  },
  {
    id: "BUS-7943",
    conductor: "Ana Torres",
    tiempo: "08:18 AM",
    ruta: "Ruta 1 → En tiempo",
    estado: "active",
    alertas: 0,
    velocidad: "42 km/h",
    telefono: "+51 999 456 789",
    fotos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop"
    ]
  },
  {
    id: "BUS-7054",
    conductor: "Roberto Silva",
    tiempo: "08:43 AM",
    ruta: "Ruta 2 → Velocidad alta",
    estado: "warning",
    alertas: 1,
    velocidad: "65 km/h",
    telefono: "+51 999 567 890",
    fotos: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop"
    ]
  }
];

// Main Dashboard Component
const MonitoringDashboard = () => {
  const { user, logout } = useAuth();
  const [buses] = useState(mockBuses);
  const [filteredBuses, setFilteredBuses] = useState(mockBuses);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [draggedBus, setDraggedBus] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  // 4. ESTADOS ADICIONALES - Agregar después de los estados existentes:
  // 4. ESTADOS ADICIONALES - Agregar después de los estados existentes:
  const [viewModes, setViewModes] = useState({
    1: '2x2',
    2: '2x2',
    3: '2x2',
    4: '2x2'
  });

  // 3. ESTADOS ADICIONALES - Reemplazar/agregar después de los estados existentes:
  const [globalViewMode, setGlobalViewMode] = useState('2x2');
  const [isMapView, setIsMapView] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedBusForPanel, setSelectedBusForPanel] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);

  // const [contextMenu, setContextMenu] = useState(null);
  // const [playingPanels, setPlayingPanels] = useState(new Set([1, 2, 3, 4])); // All panels playing by default

  const {
    contextMenu,
    playingPanels,
    mutedPanels,
    openContextMenu,
    closeContextMenu,
    handlers
  } = useContextMenu();

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
    
    // Clear selection if the selected bus is no longer in filtered results
    if (selectedBus && !filtered.find(bus => bus.id === selectedBus)) {
      setSelectedBus(null);
    }
  }, [searchTerm, routeFilter, buses, selectedBus]);

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
    // Always select the clicked bus (replace previous selection)
    setSelectedBus(busId);
    
    // Find the bus object and set it for the panel if in map view
    const bus = filteredBuses.find(b => b.id === busId);
    if (isMapView && bus) {
      setSelectedBusForPanel(bus);
      setCurrentPhotoIndex(0);
      if (!isRightPanelVisible) {
        setIsRightPanelVisible(true);
      }
    }
  };

  // 5. HANDLER PARA CAMBIO DE VISTA - Agregar esta función:
  const handleViewModeChange = (mode, panelId) => {
    setViewModes(prev => ({
      ...prev,
      [panelId]: mode
    }));

    toast({
      title: `Modo de vista cambiado`,
      description: `Panel ${panelId} configurado en ${mode}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  // 4. HANDLER PARA CAMBIO GLOBAL DE VISTA - Agregar esta función:
  const handleGlobalViewModeChange = (mode) => {
    setGlobalViewMode(mode);

    let description = '';
    switch (mode) {
      case '2x2':
        description = 'Vista cuádruple (4 paneles)';
        break;
      case '2x1':
        description = 'Vista dual horizontal (2 paneles)';
        break;
      case '1x1':
        description = 'Vista única (1 panel)';
        break;
      default:
        description = `Vista configurada en ${mode}`;
    }

    toast({
      title: `Modo de vista cambiado`,
      description,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    console.log(`Cambiando a modo: ${mode}`);
  };

  const handleMapToggle = () => {
    setIsMapView(!isMapView);

    // When switching to map view, show panel but no bus selected initially
    if (!isMapView) {
      setSelectedBusForPanel(null);
      setIsRightPanelVisible(true);
      setCurrentPhotoIndex(0);
    }

    toast({
      title: isMapView ? 'Vista de Video Digital' : 'Vista de Mapa Central',
      description: isMapView ? 'Cambiando a vista de cámaras' : 'Cambiando a vista de mapa GPS',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleRightPanel = () => {
    setIsRightPanelVisible(!isRightPanelVisible);
    toast({
      title: isRightPanelVisible ? 'Panel oculto' : 'Panel visible',
      description: isRightPanelVisible ? 'Panel de información ocultado' : 'Panel de información mostrado',
      status: 'info',
      duration: 1500,
      isClosable: true,
    });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    toast({
      title: isSidebarCollapsed ? 'Sidebar expandido' : 'Sidebar minimizado',
      description: isSidebarCollapsed ? 'Panel de unidades visible' : 'Más espacio para el contenido principal',
      status: 'info',
      duration: 1500,
      isClosable: true,
    });
  };

  // Communication functions
  const handleCall = (bus) => {
    toast({
      title: 'Llamando...',
      description: `Iniciando llamada a ${bus.conductor} (${bus.telefono})`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleTTSMessage = (bus) => {
    toast({
      title: 'Mensaje TTS enviado',
      description: `Mensaje de voz enviado a ${bus.conductor}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRequestPhoto = (bus) => {
    toast({
      title: 'Solicitando foto...',
      description: `Foto solicitada al conductor ${bus.conductor}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Photo carousel functions
  const nextPhoto = (bus) => {
    if (bus.fotos && bus.fotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % bus.fotos.length);
    }
  };

  const prevPhoto = (bus) => {
    if (bus.fotos && bus.fotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + bus.fotos.length) % bus.fotos.length);
    }
  };

  const getGridConfig = (mode) => {
    switch (mode) {
      case '2x2':
        return {
          templateColumns: '1fr 1fr',
          templateRows: '1fr 1fr',
          panelsToShow: 4
        };
      case '2x1':
        return {
          templateColumns: '1fr 1fr',
          templateRows: '1fr',
          panelsToShow: 2
        };
      case '1x1':
        return {
          templateColumns: '1fr',
          templateRows: '1fr',
          panelsToShow: 1
        };
      default:
        return {
          templateColumns: '1fr 1fr',
          templateRows: '1fr 1fr',
          panelsToShow: 4
        };
    }
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

  const handleContextMenu = (e, panelId) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      panelId
    });
  };

  // const closeContextMenu = () => {
  //   setContextMenu(null);
  // };

  // const handlePlay = () => {
  //   if (contextMenu) {
  //     setPlayingPanels(prev => new Set([...prev, contextMenu.panelId]));
  //     toast({
  //       title: 'Reproducción iniciada',
  //       status: 'success',
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //     closeContextMenu();
  //   }
  // };

  // const handleStop = () => {
  //   if (contextMenu) {
  //     setPlayingPanels(prev => {
  //       const newSet = new Set(prev);
  //       newSet.delete(contextMenu.panelId);
  //       return newSet;
  //     });
  //     toast({
  //       title: 'Reproducción pausada',
  //       status: 'info',
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //     closeContextMenu();
  //   }
  // };

  // const handleContextClose = () => {
  //   if (contextMenu) {
  //     handlePanelClose(contextMenu.panelId);
  //     closeContextMenu();
  //   }
  // };


  // 7. WRAPPER CON TEMA - Envolver todo el return con:
  return (
    <ChakraProvider theme={theme}>
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
              <Menu>
                <MenuButton
                  as={Button}
                  leftIcon={<User size={16} />}
                  colorScheme="gray"
                  size="sm"
                  variant="solid"
                  rightIcon={<ChevronDown size={14} />}
                >
                  {user?.name || 'Usuario'}
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem onClick={logout}>
                      Cerrar Sesión
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
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
          <Flex h="calc(100vh - 120px)" position="relative">
            {/* Left Sidebar - Bus List */}
            <Box
              w={isSidebarCollapsed ? "0px" : "320px"}
              bg="white"
              borderRight="1px"
              borderColor="gray.200"
              p={isSidebarCollapsed ? 0 : 5}
              overflow="hidden"
              transition="all 0.3s ease-in-out"
              position="relative"
            >
              {!isSidebarCollapsed && (
                <>
                  <Text fontSize="lg" fontWeight="600" mb={4}>
                    Unidades Activas
                  </Text>

                  <VStack spacing={3} mb={4}>
                    <Input
                      placeholder="Buscar por placa o conductor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="sm"
                      borderRadius="12px"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'blue.300' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)' }}
                    />
                    <MaterialRouteSelector
                      value={routeFilter}
                      onChange={setRouteFilter}
                    />
                  </VStack>

                  <Box
                    maxH="500px"
                    overflowY="auto"
                    css={{
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f5f9',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'linear-gradient(180deg, #cbd5e0 0%, #a0aec0 100%)',
                        borderRadius: '10px',
                        border: '2px solid #f1f5f9',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: 'linear-gradient(180deg, #a0aec0 0%, #718096 100%)',
                      },
                    }}
                  >
                    {filteredBuses.map(bus => (
                      <BusItem
                        key={bus.id}
                        bus={bus}
                        isSelected={selectedBus === bus.id}
                        onClick={() => handleBusClick(bus.id)}
                        onDragStart={(e) => handleDragStart(e, bus)}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>

            {/* Sidebar Toggle Button */}
            <Box
              position="absolute"
              left={isSidebarCollapsed ? "10px" : "310px"}
              top="20px"
              zIndex="10"
              transition="all 0.3s ease-in-out"
            >
              <IconButton
                icon={isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                onClick={toggleSidebar}
                bg="white"
                color="gray.600"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="full"
                size="sm"
                _hover={{
                  bg: 'primary.50',
                  color: 'primary.600',
                  borderColor: 'primary.300',
                  transform: 'scale(1.05)'
                }}
                _active={{ transform: 'scale(0.95)' }}
                boxShadow="md"
                transition="all 0.2s"
                aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Minimizar sidebar"}
              />
            </Box>

            {/* Center - Video Grid */}
            <Flex flex={1} direction="column" bg="white" p={5}>
              <Flex mb={4} justify="space-between" align="center">
                <HStack mb={4} spacing={4}>
                  <Button
                    variant={!isMapView ? "ghost" : "solid"}
                    size="sm"
                    leftIcon={<span>🗺️</span>}
                    color={!isMapView ? "gray.600" : "white"}
                    bg={!isMapView ? "transparent" : "primary.500"}
                    _hover={{ color: 'primary.600', bg: 'primary.50' }}
                    onClick={handleMapToggle}
                  >
                    Mapa Central
                  </Button>
                  <Button
                    variant={isMapView ? "ghost" : "videoPrimary"}
                    size="sm"
                    leftIcon={<span>📹</span>}
                    onClick={handleMapToggle}
                  >
                    Video Digital
                  </Button>
                </HStack>

                {/* Selector de modo de vista al lado derecho - solo visible en modo video */}
                {!isMapView && (
                  <ViewModeSelector
                    currentMode={globalViewMode}
                    onModeChange={handleGlobalViewModeChange}
                  />
                )}
              </Flex>

              {isMapView ? (
                /* Map View */
                <Box
                  w="100%"
                  h="100%"
                  bg="gray.50"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="gray.200"
                  position="relative"
                  overflow="hidden"
                >
                  {/* Map Header */}
                  <Flex
                    bg="white"
                    p={4}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    align="center"
                    justify="space-between"
                  >
                    <HStack spacing={3}>
                      <Box>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800">
                          Mapa GPS en Tiempo Real - Lima, Perú
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {filteredBuses.length} unidades monitoreadas
                        </Text>
                      </Box>
                    </HStack>

                    <HStack spacing={2}>
                      <Button size="sm" leftIcon={<Navigation size={16} />} colorScheme="blue">
                        Centrar Vista
                      </Button>
                      <Button size="sm" leftIcon={<Route size={16} />} variant="outline">
                        Rutas
                      </Button>
                    </HStack>
                  </Flex>

                  {/* Leaflet Map Container */}
                  <Flex w="100%" h="calc(100% - 80px)" position="relative">
                    {/* Map Container */}
                    <Box
                      w={isRightPanelVisible ? "80%" : "100%"}
                      h="100%"
                      transition="all 0.3s ease-in-out"
                    >
                      <LeafletMap
                        buses={filteredBuses}
                        onBusClick={(bus) => {
                          setSelectedBusForPanel(bus);
                          setCurrentPhotoIndex(0);
                          if (!isRightPanelVisible) {
                            setIsRightPanelVisible(true);
                          }
                          toast({
                            title: `Bus seleccionado`,
                            description: `${bus.id} - ${bus.conductor}`,
                            status: 'info',
                            duration: 2000,
                            isClosable: true,
                          });
                        }}
                      />
                    </Box>

                    {/* Right Panel Toggle Button */}
                    <Box
                      position="absolute"
                      right={isRightPanelVisible ? "20%" : "10px"}
                      top="20px"
                      zIndex="10"
                      transition="all 0.3s ease-in-out"
                    >
                      <IconButton
                        icon={isRightPanelVisible ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        onClick={toggleRightPanel}
                        bg="white"
                        color="gray.600"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="full"
                        size="sm"
                        _hover={{
                          bg: 'primary.50',
                          color: 'primary.600',
                          borderColor: 'primary.300',
                          transform: 'scale(1.05)'
                        }}
                        _active={{ transform: 'scale(0.95)' }}
                        boxShadow="md"
                        transition="all 0.2s"
                        aria-label={isRightPanelVisible ? "Ocultar panel" : "Mostrar panel"}
                      />
                    </Box>

                    {/* Right Panel for Bus Information */}
                    {isRightPanelVisible && (
                      <Box
                        w="20%"
                        bg="white"
                        borderLeft="1px solid"
                        borderColor="gray.200"
                        p={4}
                        overflowY="auto"
                        transition="all 0.3s ease-in-out"
                        minW="280px"
                      >
                        {/* Bus Info Header */}
                        <Flex justify="space-between" align="center" mb={4}>
                          <Text fontSize="md" fontWeight="bold" color="gray.800">
                            {selectedBusForPanel ? "Información del Bus" : "Panel de Control"}
                          </Text>
                        </Flex>

                        {/* Panel Content */}
                        <VStack spacing={4} align="stretch">
                          {selectedBusForPanel ? (
                            <>
                              {/* Basic Info */}
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <VStack spacing={2} align="start">
                                  <Flex justify="space-between" w="100%">
                                    <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                      {selectedBusForPanel.id}
                                    </Text>
                                    <Badge
                                      colorScheme={
                                        selectedBusForPanel.estado === 'active' ? 'green' :
                                          selectedBusForPanel.estado === 'warning' ? 'orange' : 'red'
                                      }
                                    >
                                      {selectedBusForPanel.estado === 'active' ? 'En Ruta' :
                                        selectedBusForPanel.estado === 'warning' ? 'Con Retraso' : 'Fuera de Ruta'}
                                    </Badge>
                                  </Flex>
                                  <Text color="gray.600">
                                    <strong>Conductor:</strong> {selectedBusForPanel.conductor}
                                  </Text>
                                  <Text color="gray.600">
                                    <strong>Ruta:</strong> {selectedBusForPanel.ruta}
                                  </Text>
                                  <Text color="gray.600">
                                    <strong>Velocidad:</strong> {selectedBusForPanel.velocidad}
                                  </Text>
                                  <Text color="gray.600">
                                    <strong>Último reporte:</strong> {selectedBusForPanel.tiempo}
                                  </Text>
                                </VStack>
                              </Box>

                              {/* Communication Functions */}
                              <Box>
                                <Text fontSize="md" fontWeight="600" mb={3} color="gray.700">
                                  Funciones de Comunicación
                                </Text>
                                <VStack spacing={2}>
                                  <Button
                                    leftIcon={<Phone size={16} />}
                                    colorScheme="green"
                                    size="sm"
                                    w="100%"
                                    onClick={() => handleCall(selectedBusForPanel)}
                                  >
                                    Llamar Conductor
                                  </Button>
                                  <Button
                                    leftIcon={<MessageCircle size={16} />}
                                    colorScheme="blue"
                                    size="sm"
                                    w="100%"
                                    onClick={() => handleTTSMessage(selectedBusForPanel)}
                                  >
                                    Mensaje TTS
                                  </Button>
                                  <Button
                                    leftIcon={<Camera size={16} />}
                                    colorScheme="purple"
                                    size="sm"
                                    w="100%"
                                    onClick={() => handleRequestPhoto(selectedBusForPanel)}
                                  >
                                    Solicitar Foto
                                  </Button>
                                </VStack>
                              </Box>

                              {/* Recent Photos Section */}
                              {selectedBusForPanel.fotos && selectedBusForPanel.fotos.length > 0 && (
                                <Box>
                                  <Text fontSize="md" fontWeight="600" mb={3} color="gray.700">
                                    Fotos Recientes
                                  </Text>
                                  <Box position="relative">
                                    {/* Photo Display */}
                                    <Box
                                      w="100%"
                                      h="200px"
                                      borderRadius="lg"
                                      overflow="hidden"
                                      border="1px solid"
                                      borderColor="gray.200"
                                      position="relative"
                                    >
                                      <img
                                        src={selectedBusForPanel.fotos[currentPhotoIndex]}
                                        alt={`Foto ${currentPhotoIndex + 1}`}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover'
                                        }}
                                      />

                                      {/* Photo Navigation */}
                                      {selectedBusForPanel.fotos.length > 1 && (
                                        <>
                                          <IconButton
                                            icon={<ArrowLeft size={16} />}
                                            position="absolute"
                                            left="2"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            size="sm"
                                            bg="white"
                                            opacity="0.8"
                                            _hover={{ opacity: 1 }}
                                            onClick={() => prevPhoto(selectedBusForPanel)}
                                            aria-label="Foto anterior"
                                          />
                                          <IconButton
                                            icon={<ArrowRight size={16} />}
                                            position="absolute"
                                            right="2"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            size="sm"
                                            bg="white"
                                            opacity="0.8"
                                            _hover={{ opacity: 1 }}
                                            onClick={() => nextPhoto(selectedBusForPanel)}
                                            aria-label="Foto siguiente"
                                          />
                                        </>
                                      )}
                                    </Box>

                                    {/* Photo Counter */}
                                    <Text
                                      fontSize="xs"
                                      color="gray.500"
                                      textAlign="center"
                                      mt={2}
                                    >
                                      {currentPhotoIndex + 1} de {selectedBusForPanel.fotos.length}
                                    </Text>

                                    {/* Photo Thumbnails */}
                                    {selectedBusForPanel.fotos.length > 1 && (
                                      <HStack spacing={2} mt={3} justify="center">
                                        {selectedBusForPanel.fotos.map((foto, index) => (
                                          <Box
                                            key={index}
                                            w="40px"
                                            h="30px"
                                            borderRadius="md"
                                            overflow="hidden"
                                            border="2px solid"
                                            borderColor={index === currentPhotoIndex ? "blue.500" : "gray.200"}
                                            cursor="pointer"
                                            onClick={() => setCurrentPhotoIndex(index)}
                                          >
                                            <img
                                              src={foto}
                                              alt={`Miniatura ${index + 1}`}
                                              style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                              }}
                                            />
                                          </Box>
                                        ))}
                                      </HStack>
                                    )}
                                  </Box>
                                </Box>)}
                            </>
                          ) : (
                            /* Default Panel Content */
                            <Box p={4} bg="blue.50" borderRadius="lg" textAlign="center">
                              <Text fontSize="sm" color="blue.700" mb={2}>
                                👆 Selecciona un bus en el mapa
                              </Text>
                              <Text fontSize="xs" color="blue.600">
                                Haz clic en cualquier marcador para ver la información del vehículo
                              </Text>
                            </Box>
                          )}
                        </VStack>
                      </Box>
                    )}
                  </Flex>
                </Box>
              ) : (
                /* Video Grid */
                <Grid
                  templateColumns={
                    globalViewMode === '1x1' ? '1fr' :
                      globalViewMode === '2x1' ? '1fr 1fr' :
                        '1fr 1fr'
                  }
                  templateRows={
                    globalViewMode === '1x1' ? '1fr' :
                      globalViewMode === '2x1' ? '1fr' :
                        '1fr 1fr'
                  }
                  gap={4}
                  h="100%"
                >
                  {(() => {
                    let panelsToShow = [];

                    switch (globalViewMode) {
                      case '1x1':
                        panelsToShow = [videoPanels[0]];
                        break;
                      case '2x1':
                        panelsToShow = videoPanels.slice(0, 2);
                        break;
                      case '2x2':
                      default:
                        panelsToShow = videoPanels;
                        break;
                    }

                    return panelsToShow.map(currentPanel => (
                      <GridItem key={currentPanel.id}>
                        <EnhancedCameraPanel
                          panel={currentPanel}
                          onDrop={handlePanelDrop}
                          onClose={handlePanelClose}
                          onDoubleClick={handlePanelDoubleClick}
                          onContextMenu={openContextMenu}
                          isPlaying={playingPanels.has(currentPanel.id)}
                          isMuted={mutedPanels.has(currentPanel.id)}
                          onPlayStateChange={handlers.handlePlayStateChange}
                          onMuteStateChange={handlers.handleMuteStateChange}
                        />
                      </GridItem>
                    ));
                  })()}
                </Grid>
              )}


            </Flex>
          </Flex>

          {/* Camera Selection Modal */}
          <CameraSelectionModal
            isOpen={isOpen}
            onClose={onClose}
            bus={draggedBus}
            onCameraSelect={handleCameraSelect}
          />

          {/* Context Menu */}
          <ContextMenu
            isOpen={contextMenu?.isOpen || false}
            position={contextMenu?.position}
            panelData={contextMenu?.panelData}
            onClose={closeContextMenu}
            onPlay={handlers.handlePlay}
            onPause={handlers.handlePause}
            // onClose={handlePanelClose} // Tu función existente
            onCapture={handlers.handleCapture}
            onZoom={handlers.handleZoom}
            onFullscreen={handlers.handleFullscreen}
            onMute={handlers.handleMute}
            onUnmute={handlers.handleUnmute}
            onSettings={handlers.handleSettings}
            isPlaying={contextMenu ? playingPanels.has(contextMenu.panelData?.id) : false}
            isMuted={contextMenu ? mutedPanels.has(contextMenu.panelData?.id) : false}
          />
        </Box>
      </DndProvider>
    </ChakraProvider>
  );

};

export default MonitoringDashboard;