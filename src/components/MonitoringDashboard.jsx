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
  useColorMode,
} from '@chakra-ui/react';
import { Bell, User, X, Play, Camera, ZoomIn, Square, ChevronDown, Pause, MapPin, Route, Navigation, ChevronLeft, ChevronRight, Phone, MessageCircle, ImageIcon, Send, ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';
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
import MensajeTTSModal from './MensajeTTSModal';
import CallWebRTCModal from './CallWebRTCModal';
import TakePictureModal from './TakePictureModal';
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
  const { colorMode, toggleColorMode } = useColorMode();
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
  const [isMapView, setIsMapView] = useState(() => {
    // Recuperar desde localStorage o usar false por defecto
    const savedViewState = localStorage.getItem('gps-fleet-view-mode');
    return savedViewState ? JSON.parse(savedViewState) : false;
  });
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
  const { isOpen: isTTSModalOpen, onOpen: onTTSModalOpen, onClose: onTTSModalClose } = useDisclosure();
  const { isOpen: isCallModalOpen, onOpen: onCallModalOpen, onClose: onCallModalClose } = useDisclosure();
  const { isOpen: isPictureModalOpen, onOpen: onPictureModalOpen, onClose: onPictureModalClose } = useDisclosure();
  const [selectedBusForTTS, setSelectedBusForTTS] = useState(null);
  const [selectedBusForCall, setSelectedBusForCall] = useState(null);
  const [selectedBusForPicture, setSelectedBusForPicture] = useState(null);
  const toast = useToast();

  const bgColor = useColorModeValue('app.bg.primary', 'app.bg.primary');
  const headerBg = useColorModeValue('app.surface.header', 'app.surface.header');

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

  // Keyboard shortcuts and click outside handling
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
      
      // Clear bus selection on Escape
      if (e.key === 'Escape') {
        setSelectedBus(null);
      }
    };

    const handleClickOutside = (e) => {
      // Check if click is outside the sidebar (bus list area)
      const sidebar = document.querySelector('[data-sidebar="true"]');
      if (sidebar && !sidebar.contains(e.target)) {
        setSelectedBus(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toast]);

  // Sync view state changes to localStorage (backup effect)
  useEffect(() => {
    localStorage.setItem('gps-fleet-view-mode', JSON.stringify(isMapView));
  }, [isMapView]);

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
    const newMapViewState = !isMapView;
    setIsMapView(newMapViewState);

    // Guardar estado en localStorage
    localStorage.setItem('gps-fleet-view-mode', JSON.stringify(newMapViewState));

    // When switching to map view, show panel but no bus selected initially
    if (newMapViewState) {
      setSelectedBusForPanel(null);
      setIsRightPanelVisible(true);
      setCurrentPhotoIndex(0);
    }

    toast({
      title: newMapViewState ? 'Vista de Mapa Central' : 'Vista de Video Digital',
      description: newMapViewState ? 'Cambiando a vista de mapa GPS' : 'Cambiando a vista de cámaras',
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
    setSelectedBusForCall(bus);
    onCallModalOpen();
  };

  const handleCallEnd = (bus, duration) => {
    toast({
      title: 'Llamada finalizada',
      description: `Llamada con ${bus.conductor} - Duración: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
      status: 'info',
      duration: 4000,
      isClosable: true,
    });
  };

  const handleTTSMessage = (bus) => {
    setSelectedBusForTTS(bus);
    onTTSModalOpen();
  };

  const handleSendTTSMessage = (bus, message) => {
    toast({
      title: 'Mensaje TTS enviado',
      description: `Mensaje "${message.substring(0, 30)}..." enviado a ${bus.conductor}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRequestPhoto = (bus) => {
    setSelectedBusForPicture(bus);
    onPictureModalOpen();
  };

  const handlePictureTaken = (bus, capturedResults) => {
    const successCount = capturedResults.filter(r => r.success).length;
    const totalCount = capturedResults.length;
    
    toast({
      title: 'Fotos capturadas',
      description: `${successCount}/${totalCount} fotos tomadas del vehículo ${bus.id}`,
      status: successCount > 0 ? 'success' : 'error',
      duration: 4000,
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
              
              {/* Theme Toggle Button */}
              <IconButton
                icon={colorMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                onClick={toggleColorMode}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                }}
                aria-label={colorMode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
              />
              
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

          {/* Main Content */}
          <Flex h="calc(100vh - 80px)" position="relative">
            {/* Left Sidebar - Bus List */}
            <Box
              w={isSidebarCollapsed ? "0px" : "320px"}
              bg={useColorModeValue('white', '#252a36')}
              borderRight="1px"
              borderColor={useColorModeValue('gray.200', 'transparent')}
              p={isSidebarCollapsed ? 0 : 5}
              overflow="hidden"
              transition="all 0.3s ease-in-out"
              position="relative"
              data-sidebar="true"
            >
              {!isSidebarCollapsed && (
                <>
                  <Text fontSize="lg" fontWeight="600" mb={4} color={useColorModeValue('gray.800', 'app.text.primary')}>
                    Unidades Activas
                  </Text>

                  <VStack spacing={3} mb={4}>
                    <Input
                      placeholder="Buscar por placa o conductor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="sm"
                      borderRadius="12px"
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
                        background: colorMode === 'light' ? '#f1f5f9' : '#1a1d29',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: colorMode === 'light' 
                          ? 'linear-gradient(180deg, #cbd5e0 0%, #a0aec0 100%)'
                          : 'linear-gradient(180deg, #35394a 0%, #2a2f3a 100%)',
                        borderRadius: '10px',
                        border: colorMode === 'light' ? '2px solid #f1f5f9' : '2px solid #1a1d29',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: colorMode === 'light'
                          ? 'linear-gradient(180deg, #a0aec0 0%, #718096 100%)'
                          : 'linear-gradient(180deg, #3a3f4c 0%, #35394a 100%)',
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
            <Flex flex={1} direction="column" bg={useColorModeValue('white', '#252a36')} p={5}>
              <Flex mb={4} justify="space-between" align="center">
                <HStack mb={4} spacing={4}>
                  <Button
                    variant={!isMapView ? "ghost" : "solid"}
                    size="sm"
                    leftIcon={<span>🗺️</span>}
                    color={!isMapView ? useColorModeValue("gray.600", "#e2e8f0") : "white"}
                    bg={!isMapView ? "transparent" : "primary.500"}
                    _hover={{ color: 'primary.600', bg: 'primary.50' }}
                    onClick={handleMapToggle}
                  >
                    Mapa Central
                  </Button>
                  <Button
                    variant={isMapView ? "ghost" : "solid"}
                    size="sm"
                    leftIcon={<span>📹</span>}
                    colorScheme={!isMapView ? "blue" : "gray"}
                    color={!isMapView ? "white" : useColorModeValue("gray.600", "#e2e8f0")}
                    bg={!isMapView ? "primary.500" : "transparent"}
                    _hover={{ color: 'primary.600', bg: 'primary.50' }}
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
                  bg={useColorModeValue('gray.50', '#2a2f3a')}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.200', 'transparent')}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Leaflet Map Container */}
                  <Flex w="100%" h="100%" position="relative">
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
                        bg={useColorModeValue('white', '#2f3441')}
                        borderLeft="1px solid"
                        borderColor={useColorModeValue('gray.200', 'transparent')}
                        p={4}
                        overflowY="auto"
                        transition="all 0.3s ease-in-out"
                        minW="280px"
                      >
                        {/* Bus Info Header */}
                        <Flex justify="space-between" align="center" mb={4}>
                          <Text fontSize="md" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
                            {selectedBusForPanel ? "Información del Bus" : "Panel de Control"}
                          </Text>
                        </Flex>

                        {/* Panel Content */}
                        <VStack spacing={4} align="stretch">
                          {selectedBusForPanel ? (
                            <>
                              {/* Basic Info */}
                              <Box p={4} bg={useColorModeValue('gray.50', '#35394a')} borderRadius="lg">
                                <VStack spacing={2} align="start">
                                  <Flex justify="space-between" w="100%">
                                    <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
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
                                  <Text color={useColorModeValue('gray.600', 'app.text.secondary')}>
                                    <strong>Conductor:</strong> {selectedBusForPanel.conductor}
                                  </Text>
                                  <Text color={useColorModeValue('gray.600', 'app.text.secondary')}>
                                    <strong>Ruta:</strong> {selectedBusForPanel.ruta}
                                  </Text>
                                  <Text color={useColorModeValue('gray.600', 'app.text.secondary')}>
                                    <strong>Velocidad:</strong> {selectedBusForPanel.velocidad}
                                  </Text>
                                  <Text color={useColorModeValue('gray.600', 'app.text.secondary')}>
                                    <strong>Último reporte:</strong> {selectedBusForPanel.tiempo}
                                  </Text>
                                </VStack>
                              </Box>

                              {/* Communication Functions */}
                              <Box>
                                <Text fontSize="md" fontWeight="600" mb={3} color={useColorModeValue('gray.700', 'app.text.primary')}>
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
                                  <Text fontSize="md" fontWeight="600" mb={3} color={useColorModeValue('gray.700', 'app.text.primary')}>
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
                                      borderColor={useColorModeValue('gray.200', 'gray.600')}
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
                                      color={useColorModeValue('gray.500', 'app.text.tertiary')}
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
                                            borderColor={index === currentPhotoIndex ? "blue.500" : useColorModeValue("gray.200", "gray.600")}
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
                            <Box p={4} bg={useColorModeValue('blue.50', 'primary.900')} borderRadius="lg" textAlign="center">
                              <Text fontSize="sm" color={useColorModeValue('blue.700', 'primary.200')} mb={2}>
                                👆 Selecciona un bus en el mapa
                              </Text>
                              <Text fontSize="xs" color={useColorModeValue('blue.600', 'primary.300')}>
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

          {/* Mensaje TTS Modal */}
          <MensajeTTSModal
            isOpen={isTTSModalOpen}
            onClose={onTTSModalClose}
            bus={selectedBusForTTS}
            onSendMessage={handleSendTTSMessage}
          />

          {/* Call WebRTC Modal */}
          <CallWebRTCModal
            isOpen={isCallModalOpen}
            onClose={onCallModalClose}
            bus={selectedBusForCall}
            onCallEnd={handleCallEnd}
          />

          {/* Take Picture Modal */}
          <TakePictureModal
            isOpen={isPictureModalOpen}
            onClose={onPictureModalClose}
            bus={selectedBusForPicture}
            onPictureTaken={handlePictureTaken}
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