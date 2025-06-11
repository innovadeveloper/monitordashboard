// src/components/TrackPlayerPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Input,
  Button,
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
  Checkbox,
  Select,
} from '@chakra-ui/react';
import { Bell, User, X, Play, Camera, ZoomIn, Square, ChevronDown, Pause, MapPin, Route, Navigation, ChevronLeft, ChevronRight, Phone, MessageCircle, ImageIcon, Send, ArrowLeft, ArrowRight, Sun, Moon, Grid3X3, Video, Settings, Monitor, Home, Search, CheckSquare, Square as SquareIcon } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 1. IMPORTS - Agregar al inicio del archivo
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';
// UI Components
import {
  ContextMenu,
  MaterialRouteSelector,
  LeafletMap,
  MonitoringModulesMenu
} from '../ui';

// Custom TrackBusItem component with checkbox for TrackPlayerPage
const TrackBusItem = ({ bus, isSelected, isChecked, onClick, onCheck, onDragStart }) => {
  const handleItemClick = (e) => {
    // Prevent checkbox click from triggering item selection
    if (e.target.type !== 'checkbox') {
      onClick();
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    // Double click toggles the checkbox
    onCheck(!isChecked);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'active': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box
      p={3}
      mb={2}
      bg={isSelected ? useColorModeValue('blue.50', 'blue.900') : useColorModeValue('white', '#35394a')}
      borderRadius="lg"
      border="2px solid"
      borderColor={isSelected ? useColorModeValue('blue.300', 'blue.600') : useColorModeValue('gray.200', 'transparent')}
      cursor="pointer"
      onClick={handleItemClick}
      onDoubleClick={handleDoubleClick}
      _hover={{
        bg: useColorModeValue('blue.50', 'blue.900'),
        borderColor: useColorModeValue('blue.300', 'blue.600'),
        transform: 'translateY(-1px)',
        boxShadow: 'md'
      }}
      transition="all 0.2s"
      draggable
      onDragStart={onDragStart}
    >
      <Flex align="center" justify="space-between" mb={2}>
        <HStack spacing={3}>
          <Checkbox
            isChecked={isChecked}
            onChange={(e) => onCheck(e.target.checked)}
            colorScheme="blue"
            size="md"
          />
          <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('gray.800', '#e2e8f0')}>
            {bus.id}
          </Text>
        </HStack>
        <Badge colorScheme={getStatusColor(bus.estado)} size="sm">
          {bus.estado === 'active' ? 'Activo' : bus.estado === 'warning' ? 'Alerta' : 'Error'}
        </Badge>
      </Flex>
      <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} mb={1}>
        {bus.conductor}
      </Text>
      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')}>
        {bus.ruta}
      </Text>
      <HStack spacing={2} mt={2}>
        <Text fontSize="10px" color={useColorModeValue('gray.500', 'gray.500')}>
          ⏱ {bus.tiempo}
        </Text>
        <Text fontSize="10px" color={useColorModeValue('gray.500', 'gray.500')}>
          📍 {bus.velocidad}
        </Text>
      </HStack>
    </Box>
  );
};

// Modals
import {
  CameraSelectionModal,
  MensajeTTSModal,
  RecentPictureModal,
  CallWebRTCModal,
  TakePictureModal
} from '../modals';
// Hooks and Contexts
import { useContextMenu } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';


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

// Main TrackPlayerPage Component
const TrackPlayerPage = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [buses] = useState(mockBuses);
  const [filteredBuses, setFilteredBuses] = useState(mockBuses);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [draggedBus, setDraggedBus] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [fechaInicioDate, setFechaInicioDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [fechaInicioHour, setFechaInicioHour] = useState('00');
  const [fechaFinDate, setFechaFinDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [fechaFinHour, setFechaFinHour] = useState('23');
  const [checkedBuses, setCheckedBuses] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const {
    contextMenu,
    playingPanels,
    mutedPanels,
    openContextMenu,
    closeContextMenu,
    handlers
  } = useContextMenu();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isTTSModalOpen, onOpen: onTTSModalOpen, onClose: onTTSModalClose } = useDisclosure();
  const { isOpen: isCallModalOpen, onOpen: onCallModalOpen, onClose: onCallModalClose } = useDisclosure();
  const { isOpen: isPictureModalOpen, onOpen: onPictureModalOpen, onClose: onPictureModalClose } = useDisclosure();
  const { isOpen: isRecentPictureModalOpen, onOpen: onRecentPictureModalOpen, onClose: onRecentPictureModalClose } = useDisclosure();
  const [selectedBusForTTS, setSelectedBusForTTS] = useState(null);
  const [selectedPhotoData, setSelectedPhotoData] = useState(null);
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

  const handleBusClick = (busId) => {
    // Always select the clicked bus (replace previous selection)
    setSelectedBus(busId);
  };

  const handleBusCheck = (busId, isChecked) => {
    const newCheckedBuses = new Set(checkedBuses);
    if (isChecked) {
      newCheckedBuses.add(busId);
    } else {
      newCheckedBuses.delete(busId);
    }
    setCheckedBuses(newCheckedBuses);
  };

  // const handleSelectAll = () => {
  //   const allBusIds = new Set(filteredBuses.map(bus => bus.id));
  //   setCheckedBuses(allBusIds);
  //   toast({
  //     title: 'Todas las unidades seleccionadas',
  //     description: `${filteredBuses.length} unidades seleccionadas`,
  //     status: 'success',
  //     duration: 2000,
  //     isClosable: true,
  //   });
  // };

  const handleDeselectAll = () => {
    setCheckedBuses(new Set());
    toast({
      title: 'Selección limpiada',
      description: 'Ninguna unidad seleccionada',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleConsultarRutas = async () => {
    if (!fechaInicioDate || !fechaFinDate || checkedBuses.size === 0) {
      toast({
        title: 'Datos incompletos',
        description: 'Por favor selecciona fechas y al menos una unidad',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    const formatFechaInicio = `${fechaInicioDate.split('-').reverse().join('/')} ${fechaInicioHour}:00`;
    const formatFechaFin = `${fechaFinDate.split('-').reverse().join('/')} ${fechaFinHour}:00`;
    
    // Simular consulta de rutas
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Consulta completada',
        description: `Rutas consultadas para ${checkedBuses.size} unidades del ${formatFechaInicio} al ${formatFechaFin}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
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

  const handleDragStart = (e, bus) => {
    setDraggedBus(bus);
    e.dataTransfer.setData('application/json', JSON.stringify(bus));
  };

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
              <Button
                leftIcon={<Home size={16} />}
                onClick={() => navigate('/dashboard')}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-1px)'
                }}
                _active={{
                  transform: 'translateY(0px)'
                }}
                transition="all 0.2s"
              >
                Inicio
              </Button>
              <Text fontSize="xl" fontWeight="bold">
                🎬 Reproductor de Tracks
              </Text>
            </HStack>

            <HStack spacing={4}>
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

              <MonitoringModulesMenu />
              
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
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontSize="lg" fontWeight="600" color={useColorModeValue('gray.800', 'app.text.primary')}>
                      Seleccionar Unidades
                    </Text>
                    <IconButton
                      icon={<ChevronLeft size={16} />}
                      onClick={toggleSidebar}
                      size="sm"
                      variant="ghost"
                      color={useColorModeValue('gray.600', 'gray.400')}
                      _hover={{
                        bg: useColorModeValue('gray.100', 'gray.600')
                      }}
                      aria-label="Minimizar sidebar"
                    />
                  </Flex>

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
                    
                    {/* Date Range Controls */}
                    <Box w="100%">
                      <Text fontSize="xs" fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')} mb={2}>
                        Rango de Fechas
                      </Text>
                      <VStack spacing={3}>
                        <Box w="100%">
                          <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} mb={1}>
                            Fecha Inicio
                          </Text>
                          <HStack spacing={2}>
                            <Input
                              type="date"
                              value={fechaInicioDate}
                              onChange={(e) => setFechaInicioDate(e.target.value)}
                              size="sm"
                              w="140px"
                              variant="outline"
                              borderColor={useColorModeValue('gray.100', 'transparent')}
                              bg="transparent"
                              color={useColorModeValue('gray.800', '#e2e8f0')}
                              _hover={{ 
                                borderColor: useColorModeValue('gray.300', 'gray.600')
                              }}
                              _focus={{ 
                                borderColor: useColorModeValue('blue.500', 'blue.300'),
                                boxShadow: 'none'
                              }}
                            />
                            <Select
                              value={fechaInicioHour}
                              onChange={(e) => setFechaInicioHour(e.target.value)}
                              size="sm"
                              w="90px"
                              border="1px solid"
                              borderColor={useColorModeValue('gray.100', 'transparent')}
                              bg={useColorModeValue('white', '#2a2f3a')}
                              color={useColorModeValue('gray.800', '#e2e8f0')}
                              iconSize="14px"
                              _hover={{ 
                                borderColor: useColorModeValue('blue.300', 'primary.600'),
                                bg: useColorModeValue('gray.50', '#2f3441')
                              }}
                              _focus={{ 
                                borderColor: useColorModeValue('blue.500', 'primary.500'),
                                boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none'),
                                bg: useColorModeValue('white', '#2f3441')
                              }}
                              sx={{
                                '& > option': {
                                  paddingRight: '8px',
                                  backgroundColor: useColorModeValue('#ffffff', '#2a2f3a'),
                                  color: useColorModeValue('gray.800', '#e2e8f0')
                                }
                              }}
                            >
                              {Array.from({length: 24}, (_, i) => (
                                <option key={i} value={String(i).padStart(2, '0')}>
                                  {String(i).padStart(2, '0')}:00
                                </option>
                              ))}
                            </Select>
                          </HStack>
                        </Box>
                        <Box w="100%">
                          <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} mb={1}>
                            Fecha Fin
                          </Text>
                          <HStack spacing={2}>
                            <Input
                              type="date"
                              value={fechaFinDate}
                              onChange={(e) => setFechaFinDate(e.target.value)}
                              size="sm"
                              w="140px"
                              variant="outline"
                              borderColor={useColorModeValue('gray.100', 'transparent')}
                              bg="transparent"
                              color={useColorModeValue('gray.800', '#e2e8f0')}
                              _hover={{ 
                                borderColor: useColorModeValue('gray.300', 'gray.600')
                              }}
                              _focus={{ 
                                borderColor: useColorModeValue('blue.500', 'blue.300'),
                                boxShadow: 'none'
                              }}
                            />
                            <Select
                              value={fechaFinHour}
                              onChange={(e) => setFechaFinHour(e.target.value)}
                              size="sm"
                              w="90px"
                              border="1px solid"
                              borderColor={useColorModeValue('gray.100', 'transparent')}
                              bg={useColorModeValue('white', '#2a2f3a')}
                              color={useColorModeValue('gray.800', '#e2e8f0')}
                              iconSize="14px"
                              _hover={{ 
                                borderColor: useColorModeValue('blue.300', 'primary.600'),
                                bg: useColorModeValue('gray.50', '#2f3441')
                              }}
                              _focus={{ 
                                borderColor: useColorModeValue('blue.500', 'primary.500'),
                                boxShadow: useColorModeValue('0 0 0 1px rgba(66, 153, 225, 0.6)', 'none'),
                                bg: useColorModeValue('white', '#2f3441')
                              }}
                              sx={{
                                '& > option': {
                                  paddingRight: '8px',
                                  backgroundColor: useColorModeValue('#ffffff', '#2a2f3a'),
                                  color: useColorModeValue('gray.800', '#e2e8f0')
                                }
                              }}
                            >
                              {Array.from({length: 24}, (_, i) => (
                                <option key={i} value={String(i).padStart(2, '0')}>
                                  {String(i).padStart(2, '0')}:00
                                </option>
                              ))}
                            </Select>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                    
                    <Button
                      leftIcon={<Search size={16} />}
                      colorScheme="blue"
                      size="sm"
                      w="100%"
                      onClick={handleConsultarRutas}
                      isLoading={isLoading}
                      loadingText="Consultando..."
                      isDisabled={!fechaInicioDate || !fechaFinDate || checkedBuses.size === 0}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'md'
                      }}
                      transition="all 0.2s"
                    >
                      Consultar Rutas ({checkedBuses.size})
                    </Button>
                  </VStack>

                  {/* Select All / Deselect All Controls */}
                  <HStack spacing={2} w="100%" mb={3}>
                    {/* <Button
                      leftIcon={<CheckSquare size={14} />}
                      size="xs"
                      colorScheme="green"
                      variant="outline"
                      flex={1}
                      onClick={handleSelectAll}
                      isDisabled={filteredBuses.length === 0}
                      _hover={{
                        bg: 'green.50',
                        borderColor: 'green.300'
                      }}
                    >
                      Todas
                    </Button> */}
                    <Button
                      leftIcon={<SquareIcon size={14} />}
                      size="xs"
                      colorScheme="red"
                      variant="outline"
                      flex={1}
                      onClick={handleDeselectAll}
                      isDisabled={checkedBuses.size === 0}
                      _hover={{
                        bg: 'red.50',
                        borderColor: 'red.300'
                      }}
                    >
                      Ninguna
                    </Button>
                  </HStack>

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
                      <TrackBusItem
                        key={bus.id}
                        bus={bus}
                        isSelected={selectedBus === bus.id}
                        isChecked={checkedBuses.has(bus.id)}
                        onClick={() => handleBusClick(bus.id)}
                        onCheck={(isChecked) => handleBusCheck(bus.id, isChecked)}
                        onDragStart={(e) => handleDragStart(e, bus)}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>

            {/* Sidebar Toggle Button - Solo visible cuando el sidebar está cerrado */}
            {isSidebarCollapsed && (
              <Box
                position="absolute"
                left="10px"
                top="20px"
                zIndex="1000"
                transition="all 0.3s ease-in-out"
              >
                <IconButton
                  icon={<ChevronRight size={20} />}
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
                  aria-label="Expandir sidebar"
                />
              </Box>
            )}

            {/* Center - Map View */}
            <Flex flex={1} direction="column" bg={useColorModeValue('white', '#252a36')} p={5}>
              {/* Map Container */}
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
                <LeafletMap
                  buses={filteredBuses}
                  onBusClick={(bus) => {
                    setSelectedBus(bus.id);
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
            </Flex>
          </Flex>

          {/* Camera Selection Modal */}
          <CameraSelectionModal
            isOpen={isOpen}
            onClose={onClose}
            bus={draggedBus}
            onCameraSelect={() => {}}
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

          {/* Recent Picture Modal */}
          <RecentPictureModal
            isOpen={isRecentPictureModalOpen}
            onClose={onRecentPictureModalClose}
            imageUrl={selectedPhotoData?.imageUrl}
            bus={selectedPhotoData?.bus}
            photoIndex={selectedPhotoData?.photoIndex}
            totalPhotos={selectedPhotoData?.totalPhotos}
            onPrevious={null}
            onNext={null}
          />

          {/* Context Menu */}
          <ContextMenu
            isOpen={contextMenu?.isOpen || false}
            position={contextMenu?.position}
            panelData={contextMenu?.panelData}
            onClose={closeContextMenu}
            onPlay={handlers.handlePlay}
            onPause={handlers.handlePause}
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

export default TrackPlayerPage;