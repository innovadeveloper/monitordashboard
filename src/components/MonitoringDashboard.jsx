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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Divider,
} from '@chakra-ui/react';
import { Bell, User, X, Play, Camera, ZoomIn, Square, ChevronDown, Pause, MapPin, Route, Navigation } from 'lucide-react';
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
import { useContextMenu } from '../hooks/useContextMenu';


const mockBuses = [
  { id: "BUS-1565", conductor: "Juan Pérez", tiempo: "08:34 AM", ruta: "Ruta 1 → Terminal Norte", estado: "active", alertas: 0 },
  { id: "BUS-1357", conductor: "María González", tiempo: "08:22 AM", ruta: "Ruta 2 → Con retraso", estado: "warning", alertas: 1 },
  { id: "BUS-2535", conductor: "Carlos López", tiempo: "08:15 AM", ruta: "Ruta 3 → Fuera de ruta", estado: "error", alertas: 3 },
  { id: "BUS-7943", conductor: "Ana Torres", tiempo: "08:18 AM", ruta: "Ruta 1 → En tiempo", estado: "active", alertas: 0 },
  { id: "BUS-7054", conductor: "Roberto Silva", tiempo: "08:43 AM", ruta: "Ruta 2 → Velocidad alta", estado: "warning", alertas: 1 }
];

// Main Dashboard Component
const MonitoringDashboard = () => {
  const [buses] = useState(mockBuses);
  const [filteredBuses, setFilteredBuses] = useState(mockBuses);
  const [selectedBuses, setSelectedBuses] = useState(new Set());
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
                    isSelected={selectedBuses.has(bus.id)}
                    onClick={() => handleBusClick(bus.id)}
                    onDragStart={(e) => handleDragStart(e, bus)}
                  />
                ))}
              </Box>
            </Box>

            {/* Center - Video Grid */}
            <Flex flex={1} direction="column" bg="white" p={5}>
              <Flex mb={4} justify="space-between" align="center">
                <HStack mb={4} spacing={4}>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<span>🗺️</span>}
                    color="gray.600"
                    _hover={{ color: 'primary.600', bg: 'primary.50' }}
                  >
                    Mapa Central
                  </Button>
                  <Button
                    variant="videoPrimary"
                    size="sm"
                    leftIcon={<span>📹</span>}
                  >
                    Video Digital
                  </Button>
                </HStack>

                {/* Selector de modo de vista al lado derecho */}
                <ViewModeSelector
                  currentMode={globalViewMode}
                  onModeChange={handleGlobalViewModeChange}
                />
              </Flex>

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