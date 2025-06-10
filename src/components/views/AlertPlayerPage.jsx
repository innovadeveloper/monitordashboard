// src/components/AlertPlayerPage.jsx
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Bell, User, X, Play, Camera, ZoomIn, Square, ChevronDown, Pause, MapPin, Route, Navigation, ChevronLeft, ChevronRight, Phone, MessageCircle, ImageIcon, Send, ArrowLeft, ArrowRight, Sun, Moon, Grid3X3, Video, Settings, Monitor, Home, Search, Eye, CheckSquare, Square as SquareIcon } from 'lucide-react';
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
    codConductor: "C001",
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
    codConductor: "C002",
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
    codConductor: "C003",
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
    codConductor: "C004",
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
    codConductor: "C005",
    fotos: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop"
    ]
  }
];

// Mock alerts data spanning 2024-2025
const mockAlerts = [
  // January 2024
  {
    id: "ALT-001",
    fechaHora: "2024-01-15 08:45:23",
    ruta: "Ruta 1",
    placa: "BUS-1565",
    paradero: "Av. Principal 123",
    codConductor: "C001",
    nombreConductor: "Juan Pérez",
    tipoAlerta: "Velocidad Excesiva",
    estadoAlerta: "Resuelta",
    comentario: "Velocidad detectada: 75 km/h en zona de 50 km/h",
    coordenadas: { lat: -12.0464, lng: -77.0428 },
    prioridad: "alta"
  },
  {
    id: "ALT-002",
    fechaHora: "2024-02-20 14:30:12",
    ruta: "Ruta 2",
    placa: "BUS-1357",
    paradero: "Jr. Los Olivos 456",
    codConductor: "C002",
    nombreConductor: "María González",
    tipoAlerta: "Desvío de Ruta",
    estadoAlerta: "Resuelta",
    comentario: "Vehículo fuera de ruta programada por 15 minutos",
    coordenadas: { lat: -12.0564, lng: -77.0528 },
    prioridad: "media"
  },
  // March 2024
  {
    id: "ALT-003",
    fechaHora: "2024-03-10 10:30:12",
    ruta: "Ruta 3",
    placa: "BUS-2535",
    paradero: "Av. Universitaria 789",
    codConductor: "C003",
    nombreConductor: "Carlos López",
    tipoAlerta: "Parada Prolongada",
    estadoAlerta: "Resuelta",
    comentario: "Vehículo detenido por más de 20 minutos sin autorización",
    coordenadas: { lat: -12.0664, lng: -77.0628 },
    prioridad: "baja"
  },
  {
    id: "ALT-004",
    fechaHora: "2024-04-05 16:15:33",
    ruta: "Ruta 1",
    placa: "BUS-7943",
    paradero: "Av. Arequipa 321",
    codConductor: "C004",
    nombreConductor: "Ana Torres",
    tipoAlerta: "Emergencia",
    estadoAlerta: "Resuelta",
    comentario: "Botón de pánico activado por el conductor",
    coordenadas: { lat: -12.0764, lng: -77.0728 },
    prioridad: "critica"
  },
  // May 2024
  {
    id: "ALT-005",
    fechaHora: "2024-05-18 12:05:55",
    ruta: "Ruta 2",
    placa: "BUS-7054",
    paradero: "Jr. Cusco 654",
    codConductor: "C005",
    nombreConductor: "Roberto Silva",
    tipoAlerta: "Mantenimiento",
    estadoAlerta: "Resuelta",
    comentario: "Revisión técnica programada - combustible bajo",
    coordenadas: { lat: -12.0864, lng: -77.0828 },
    prioridad: "media"
  },
  {
    id: "ALT-006",
    fechaHora: "2024-06-22 07:20:45",
    ruta: "Ruta 1",
    placa: "BUS-1565",
    paradero: "Av. Javier Prado 890",
    codConductor: "C001",
    nombreConductor: "Juan Pérez",
    tipoAlerta: "Falta Combustible",
    estadoAlerta: "Resuelta",
    comentario: "Nivel de combustible crítico - 5% restante",
    coordenadas: { lat: -12.0364, lng: -77.0328 },
    prioridad: "alta"
  },
  // July 2024
  {
    id: "ALT-007",
    fechaHora: "2024-07-14 13:45:12",
    ruta: "Ruta 3",
    placa: "BUS-2535",
    paradero: "Av. Brasil 1234",
    codConductor: "C003",
    nombreConductor: "Carlos López",
    tipoAlerta: "Exceso Pasajeros",
    estadoAlerta: "Resuelta",
    comentario: "Capacidad máxima excedida en 15 pasajeros",
    coordenadas: { lat: -12.0264, lng: -77.0228 },
    prioridad: "media"
  },
  {
    id: "ALT-008",
    fechaHora: "2024-08-03 09:30:22",
    ruta: "Ruta 2",
    placa: "BUS-1357",
    paradero: "Jr. Lampa 567",
    codConductor: "C002",
    nombreConductor: "María González",
    tipoAlerta: "Falla Mecánica",
    estadoAlerta: "Resuelta",
    comentario: "Sistema de frenos reporta anomalía",
    coordenadas: { lat: -12.0164, lng: -77.0128 },
    prioridad: "critica"
  },
  // September 2024
  {
    id: "ALT-009",
    fechaHora: "2024-09-25 15:10:18",
    ruta: "Ruta 1",
    placa: "BUS-7943",
    paradero: "Av. Colonial 345",
    codConductor: "C004",
    nombreConductor: "Ana Torres",
    tipoAlerta: "Accidente Menor",
    estadoAlerta: "Resuelta",
    comentario: "Colisión menor en estacionamiento, sin heridos",
    coordenadas: { lat: -12.0064, lng: -77.0028 },
    prioridad: "alta"
  },
  {
    id: "ALT-010",
    fechaHora: "2024-10-12 11:25:33",
    ruta: "Ruta 2",
    placa: "BUS-7054",
    paradero: "Av. Tacna 678",
    codConductor: "C005",
    nombreConductor: "Roberto Silva",
    tipoAlerta: "Retraso Programación",
    estadoAlerta: "Resuelta",
    comentario: "Retraso de 25 minutos por tráfico vehicular",
    coordenadas: { lat: -12.0964, lng: -77.0928 },
    prioridad: "baja"
  },
  // November 2024
  {
    id: "ALT-011",
    fechaHora: "2024-11-08 17:40:15",
    ruta: "Ruta 3",
    placa: "BUS-2535",
    paradero: "Av. Grau 432",
    codConductor: "C003",
    nombreConductor: "Carlos López",
    tipoAlerta: "Vandalismo",
    estadoAlerta: "En Proceso",
    comentario: "Daños reportados en asientos del vehículo",
    coordenadas: { lat: -12.1064, lng: -77.1028 },
    prioridad: "media"
  },
  {
    id: "ALT-012",
    fechaHora: "2024-12-01 06:15:44",
    ruta: "Ruta 1",
    placa: "BUS-1565",
    paradero: "Av. Abancay 789",
    codConductor: "C001",
    nombreConductor: "Juan Pérez",
    tipoAlerta: "Temperatura Motor",
    estadoAlerta: "En Proceso",
    comentario: "Temperatura del motor por encima del rango normal",
    coordenadas: { lat: -12.1164, lng: -77.1128 },
    prioridad: "alta"
  },
  // December 2024
  {
    id: "ALT-013",
    fechaHora: "2024-12-15 20:30:12",
    ruta: "Ruta 2",
    placa: "BUS-1357",
    paradero: "Jr. Huancavelica 234",
    codConductor: "C002",
    nombreConductor: "María González",
    tipoAlerta: "Horario Nocturno",
    estadoAlerta: "Activa",
    comentario: "Vehículo operando fuera del horario autorizado",
    coordenadas: { lat: -12.1264, lng: -77.1228 },
    prioridad: "media"
  },
  {
    id: "ALT-014",
    fechaHora: "2024-12-28 14:45:08",
    ruta: "Ruta 3",
    placa: "BUS-2535",
    paradero: "Av. Venezuela 567",
    codConductor: "C003",
    nombreConductor: "Carlos López",
    tipoAlerta: "GPS Desconectado",
    estadoAlerta: "Activa",
    comentario: "Pérdida de señal GPS por más de 10 minutos",
    coordenadas: { lat: -12.1364, lng: -77.1328 },
    prioridad: "alta"
  },
  // January 2025 (Recent/Current)
  {
    id: "ALT-015",
    fechaHora: "2025-01-02 08:20:15",
    ruta: "Ruta 1",
    placa: "BUS-7943",
    paradero: "Av. Petit Thouars 890",
    codConductor: "C004",
    nombreConductor: "Ana Torres",
    tipoAlerta: "Conductor Ausente",
    estadoAlerta: "Crítica",
    comentario: "Vehículo encendido sin conductor por más de 5 minutos",
    coordenadas: { lat: -12.1464, lng: -77.1428 },
    prioridad: "critica"
  },
  {
    id: "ALT-016",
    fechaHora: "2025-01-05 10:35:22",
    ruta: "Ruta 2",
    placa: "BUS-7054",
    paradero: "Jr. Ica 123",
    codConductor: "C005",
    nombreConductor: "Roberto Silva",
    tipoAlerta: "Consumo Excesivo",
    estadoAlerta: "Activa",
    comentario: "Consumo de combustible 40% por encima del promedio",
    coordenadas: { lat: -12.1564, lng: -77.1528 },
    prioridad: "media"
  },
  {
    id: "ALT-017",
    fechaHora: "2025-01-08 16:50:33",
    ruta: "Ruta 3",
    placa: "BUS-2535",
    paradero: "Av. Alfonso Ugarte 456",
    codConductor: "C003",
    nombreConductor: "Carlos López",
    tipoAlerta: "Puerta Abierta",
    estadoAlerta: "Activa",
    comentario: "Puerta trasera abierta durante trayecto por más de 2 minutos",
    coordenadas: { lat: -12.1664, lng: -77.1628 },
    prioridad: "alta"
  },
  {
    id: "ALT-018",
    fechaHora: "2025-01-10 12:15:44",
    ruta: "Ruta 1",
    placa: "BUS-1565",
    paradero: "Av. Lima 789",
    codConductor: "C001",
    nombreConductor: "Juan Pérez",
    tipoAlerta: "Velocidad Baja",
    estadoAlerta: "Programada",
    comentario: "Velocidad promedio por debajo de 15 km/h por más de 30 minutos",
    coordenadas: { lat: -12.1764, lng: -77.1728 },
    prioridad: "baja"
  },
  {
    id: "ALT-019",
    fechaHora: "2025-01-12 19:25:12",
    ruta: "Ruta 2",
    placa: "BUS-1357",
    paradero: "Jr. Callao 321",
    codConductor: "C002",
    nombreConductor: "María González",
    tipoAlerta: "Batería Baja",
    estadoAlerta: "Activa",
    comentario: "Nivel de batería del sistema GPS al 15%",
    coordenadas: { lat: -12.1864, lng: -77.1828 },
    prioridad: "media"
  },
  {
    id: "ALT-020",
    fechaHora: "2025-01-15 07:10:55",
    ruta: "Ruta 3",
    placa: "BUS-7943",
    paradero: "Av. Garcilaso 654",
    codConductor: "C004",
    nombreConductor: "Ana Torres",
    tipoAlerta: "Mantenimiento Preventivo",
    estadoAlerta: "Programada",
    comentario: "Vehículo programado para mantenimiento de 15,000 km",
    coordenadas: { lat: -12.1964, lng: -77.1928 },
    prioridad: "baja"
  }
];

// Custom BusItem component with checkbox for AlertPlayerPage
const AlertBusItem = ({ bus, isSelected, isChecked, onClick, onCheck, onDragStart }) => {
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
      <Text fontSize="xs" color={useColorModeValue('gray.600', '#a0aec0')} mb={1}>
        {bus.conductor} • {bus.tiempo}
      </Text>
      <Text fontSize="xs" color={useColorModeValue('gray.500', '#718096')}>
        {bus.ruta}
      </Text>
    </Box>
  );
};

// Main AlertPlayerPage Component
const AlertPlayerPage = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [buses] = useState(mockBuses);
  const [filteredBuses, setFilteredBuses] = useState(mockBuses);
  const [selectedBus, setSelectedBus] = useState(null);
  const [checkedBuses, setCheckedBuses] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize dates with today and tomorrow
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  const [fechaInicio, setFechaInicio] = useState(getToday());
  const [fechaFin, setFechaFin] = useState(getTomorrow());
  const mapRef = useRef(null);

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
    setSelectedBus(busId);
  };

  const handleBusCheck = (busId, checked) => {
    const newCheckedBuses = new Set(checkedBuses);
    if (checked) {
      newCheckedBuses.add(busId);
    } else {
      newCheckedBuses.delete(busId);
    }
    setCheckedBuses(newCheckedBuses);
  };

  const handleSelectAll = () => {
    const allBusIds = filteredBuses.map(bus => bus.id);
    setCheckedBuses(new Set(allBusIds));
    toast({
      title: 'Todas las unidades seleccionadas',
      description: `${allBusIds.length} unidades seleccionadas`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeselectAll = () => {
    setCheckedBuses(new Set());
    toast({
      title: 'Selección limpiada',
      description: 'Todas las unidades deseleccionadas',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleConsultarAlertas = () => {
    if (checkedBuses.size === 0) {
      toast({
        title: 'Seleccione unidades',
        description: 'Debe seleccionar al menos una unidad para consultar alertas',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!fechaInicio || !fechaFin) {
      toast({
        title: 'Fechas requeridas',
        description: 'Debe especificar fecha de inicio y fecha de fin',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast({
        title: 'Fechas inválidas',
        description: 'La fecha de inicio debe ser anterior a la fecha de fin',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter alerts based on selected buses and date range
      const selectedBusIds = Array.from(checkedBuses);
      const startDate = new Date(fechaInicio);
      const endDate = new Date(fechaFin);
      endDate.setHours(23, 59, 59, 999); // Include full end date
      
      const filteredAlerts = mockAlerts.filter(alert => {
        const alertDate = new Date(alert.fechaHora);
        return selectedBusIds.includes(alert.placa) &&
               alertDate >= startDate &&
               alertDate <= endDate;
      });
      
      setAlerts(filteredAlerts);
      setIsLoading(false);
      
      toast({
        title: 'Consulta completada',
        description: `Se encontraron ${filteredAlerts.length} alertas para las unidades seleccionadas en el rango de fechas`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };

  const handleVerEnMapa = (alert) => {
    // Pan to alert location on map
    if (mapRef.current && mapRef.current.panTo) {
      mapRef.current.panTo([alert.coordenadas.lat, alert.coordenadas.lng]);
      mapRef.current.setZoom(16);
    }
    
    toast({
      title: 'Ubicación de alerta',
      description: `Mostrando alerta ${alert.tipoAlerta} en ${alert.paradero}`,
      status: 'info',
      duration: 3000,
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

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'critica': return 'red';
      case 'alta': return 'orange';
      case 'media': return 'yellow';
      case 'baja': return 'green';
      default: return 'gray';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activa': return 'red';
      case 'En Proceso': return 'orange';
      case 'Resuelta': return 'green';
      case 'Programada': return 'blue';
      case 'Crítica': return 'purple';
      default: return 'gray';
    }
  };

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
                🚨 Sistema de Alertas
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
          <Flex h="calc(100vh - 80px)" position="relative" direction="column">
            <Flex flex="1" position="relative">
              {/* Left Sidebar - Bus List with Checkboxes */}
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
                        <VStack spacing={2}>
                          <Box w="100%">
                            <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} mb={1}>
                              Fecha Inicio
                            </Text>
                            <Input
                              type="date"
                              value={fechaInicio}
                              onChange={(e) => setFechaInicio(e.target.value)}
                              size="sm"
                              borderRadius="8px"
                              border="1px solid"
                              borderColor={useColorModeValue('gray.200', 'transparent')}
                              bg={useColorModeValue('white', '#2a2f3a')}
                              color={useColorModeValue('gray.800', '#e2e8f0')}
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
                          </Box>
                          <Box w="100%">
                            <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} mb={1}>
                              Fecha Fin
                            </Text>
                            <Input
                              type="date"
                              value={fechaFin}
                              onChange={(e) => setFechaFin(e.target.value)}
                              size="sm"
                              borderRadius="8px"
                              border="1px solid"
                              borderColor={useColorModeValue('gray.200', 'transparent')}
                              bg={useColorModeValue('white', '#2a2f3a')}
                              color={useColorModeValue('gray.800', '#e2e8f0')}
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
                          </Box>
                        </VStack>
                      </Box>
                      
                      <Button
                        leftIcon={<Search size={16} />}
                        colorScheme="blue"
                        size="sm"
                        w="100%"
                        onClick={handleConsultarAlertas}
                        isLoading={isLoading}
                        loadingText="Consultando..."
                        isDisabled={!fechaInicio || !fechaFin || checkedBuses.size === 0}
                        _hover={{
                          transform: 'translateY(-1px)',
                          boxShadow: 'md'
                        }}
                        transition="all 0.2s"
                      >
                        Consultar Alertas ({checkedBuses.size})
                      </Button>
                    </VStack>

                    {/* Select All / Deselect All Controls */}
                    <HStack spacing={2} w="100%" mb={3}>
                      <Button
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
                      </Button>
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
                      maxH="350px"
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
                        <AlertBusItem
                          key={bus.id}
                          bus={bus}
                          isSelected={selectedBus === bus.id}
                          isChecked={checkedBuses.has(bus.id)}
                          onClick={() => handleBusClick(bus.id)}
                          onCheck={(checked) => handleBusCheck(bus.id, checked)}
                          onDragStart={(e) => {}}
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
                  left="15px"
                  top="15px"
                  zIndex="1000"
                  transition="all 0.3s ease-in-out"
                >
                  <IconButton
                    icon={<ChevronRight size={20} />}
                    onClick={toggleSidebar}
                    bg={useColorModeValue('white', 'gray.800')}
                    color={useColorModeValue('gray.600', 'gray.200')}
                    border="2px solid"
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    borderRadius="full"
                    size="md"
                    _hover={{
                      bg: useColorModeValue('primary.50', 'primary.900'),
                      color: useColorModeValue('primary.600', 'primary.200'),
                      borderColor: useColorModeValue('primary.400', 'primary.500'),
                      transform: 'scale(1.1)',
                      boxShadow: 'lg'
                    }}
                    _active={{ transform: 'scale(0.95)' }}
                    boxShadow="xl"
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
                  h="60%"
                  bg={useColorModeValue('gray.50', '#2a2f3a')}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.200', 'transparent')}
                  position="relative"
                  overflow="hidden"
                  mb={4}
                >
                  <LeafletMap
                    ref={mapRef}
                    buses={filteredBuses}
                    alerts={alerts}
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

                {/* Alert Reports Table */}
                <Box
                  w="100%"
                  h="40%"
                  bg={useColorModeValue('white', '#2f3441')}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  overflow="hidden"
                  display="flex"
                  flexDirection="column"
                >
                  <Box p={4} borderBottom="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')} flexShrink={0}>
                    <Text fontSize="lg" fontWeight="600" color={useColorModeValue('gray.800', 'app.text.primary')}>
                      Reporte de Alertas ({alerts.length})
                    </Text>
                  </Box>
                  
                  {alerts.length === 0 ? (
                    <Box p={8} textAlign="center" flex={1} display="flex" alignItems="center" justifyContent="center">
                      <Text color={useColorModeValue('gray.500', 'gray.400')}>
                        {checkedBuses.size === 0 
                          ? 'Seleccione unidades y haga clic en "Consultar Alertas" para ver los reportes'
                          : 'No hay alertas para las unidades seleccionadas'
                        }
                      </Text>
                    </Box>
                  ) : (
                    <Box flex={1} overflow="hidden" position="relative">
                      {/* Fixed Header */}
                      <Box 
                        position="sticky" 
                        top={0} 
                        zIndex={10}
                        bg={useColorModeValue('gray.50', '#35394a')}
                        borderBottom="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                      >
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th w="140px" minW="140px" fontSize="xs" py={3}>Fecha/Hora</Th>
                              <Th w="80px" minW="80px" fontSize="xs" py={3}>Placa</Th>
                              <Th w="120px" minW="120px" fontSize="xs" py={3}>Conductor</Th>
                              <Th w="120px" minW="120px" fontSize="xs" py={3}>Tipo Alerta</Th>
                              <Th w="150px" minW="150px" fontSize="xs" py={3}>Paradero</Th>
                              <Th w="90px" minW="90px" fontSize="xs" py={3}>Estado</Th>
                              <Th w="80px" minW="80px" fontSize="xs" py={3}>Prioridad</Th>
                              <Th w="70px" minW="70px" fontSize="xs" py={3}>Acciones</Th>
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
                            {alerts.map((alert) => (
                              <Tr key={alert.id} _hover={{ bg: useColorModeValue('gray.50', '#3a3f4c') }}>
                                <Td w="140px" minW="140px" fontSize="xs" py={2} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                  {alert.fechaHora}
                                </Td>
                                <Td w="80px" minW="80px" fontWeight="semibold" fontSize="xs" py={2}>
                                  {alert.placa}
                                </Td>
                                <Td w="120px" minW="120px" fontSize="xs" py={2} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                  {alert.nombreConductor}
                                </Td>
                                <Td w="120px" minW="120px" fontSize="xs" py={2} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                  {alert.tipoAlerta}
                                </Td>
                                <Td w="150px" minW="150px" fontSize="xs" py={2} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={alert.paradero}>
                                  {alert.paradero}
                                </Td>
                                <Td w="90px" minW="90px" py={2}>
                                  <Badge colorScheme={getEstadoColor(alert.estadoAlerta)} size="sm" fontSize="10px">
                                    {alert.estadoAlerta}
                                  </Badge>
                                </Td>
                                <Td w="80px" minW="80px" py={2}>
                                  <Badge colorScheme={getPrioridadColor(alert.prioridad)} size="sm" fontSize="9px">
                                    {alert.prioridad.toUpperCase()}
                                  </Badge>
                                </Td>
                                <Td w="70px" minW="70px" py={2} textAlign="center">
                                  <IconButton
                                    icon={<Eye size={12} />}
                                    size="xs"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => handleVerEnMapa(alert)}
                                    aria-label="Ver en mapa"
                                    title="Ver ubicación en mapa"
                                  />
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Flex>
            </Flex>
          </Flex>

          {/* Modals */}
          <CameraSelectionModal
            isOpen={isOpen}
            onClose={onClose}
            bus={null}
            onCameraSelect={() => {}}
          />

          <MensajeTTSModal
            isOpen={isTTSModalOpen}
            onClose={onTTSModalClose}
            bus={selectedBusForTTS}
            onSendMessage={() => {}}
          />

          <CallWebRTCModal
            isOpen={isCallModalOpen}
            onClose={onCallModalClose}
            bus={selectedBusForCall}
            onCallEnd={() => {}}
          />

          <TakePictureModal
            isOpen={isPictureModalOpen}
            onClose={onPictureModalClose}
            bus={selectedBusForPicture}
            onPictureTaken={() => {}}
          />

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

export default AlertPlayerPage;