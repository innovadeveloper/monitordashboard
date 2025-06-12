// src/components/ui/GoogleMap.jsx
import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Text, VStack, Badge, HStack, Button, useColorModeValue, Spinner, Center } from '@chakra-ui/react';
import { Phone, MessageCircle, Camera, MapPin } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px'
};

// Coordenadas por defecto para Lima, Perú
const defaultCenter = {
  lat: -12.046373,
  lng: -77.042755
};

// Estilos para modo claro - ocultar POIs innecesarios pero mantener marcadores personalizados
const lightMapStyles = [
  {
    "featureType": "poi.business",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.medical",
    "elementType": "labels", 
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.place_of_worship",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.school",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.sports_complex",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.government",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.attraction",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit.station",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit.station.bus",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit.station.rail",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit.line",
    "stylers": [{ "visibility": "off" }]
  }
];

// Estilos para modo oscuro
const darkMapStyles = [
  {
    "featureType": "poi.business",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.medical",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.place_of_worship",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.school",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.sports_complex",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.government",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.attraction",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.park",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit.station",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit.station.bus",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit.station.rail",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit.line",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#263c3f" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#6b9a76" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#38414e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#212a37" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9ca5b3" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#1f2835" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#f3d19c" }]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{ "color": "#2f3948" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#17263c" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#515c6d" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#17263c" }]
  }
];

const GoogleMapComponent = ({ buses = [], onBusClick }) => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [markersInitialized, setMarkersInitialized] = useState(false); // Para evitar múltiples inicializaciones
  const isDarkMode = useColorModeValue(false, true);

  // Buses de prueba fijos para asegurar que siempre se vean marcadores
  const testBuses = [
    {
      id: "BUS-001",
      conductor: "Juan Pérez",
      tiempo: "08:34 AM",
      ruta: "Ruta 1 → Terminal Norte",
      estado: "active",
      alertas: 0,
      velocidad: "45 km/h",
      telefono: "+51 999 123 456"
    },
    {
      id: "BUS-002",
      conductor: "María González",
      tiempo: "08:22 AM",
      ruta: "Ruta 2 → Con retraso",
      estado: "warning",
      alertas: 1,
      velocidad: "38 km/h",
      telefono: "+51 999 234 567"
    },
    {
      id: "BUS-003",
      conductor: "Carlos López",
      tiempo: "08:15 AM",
      ruta: "Ruta 3 → Fuera de ruta",
      estado: "error",
      alertas: 3,
      velocidad: "0 km/h",
      telefono: "+51 999 345 678"
    },
    {
      id: "BUS-004",
      conductor: "Ana Torres",
      tiempo: "08:18 AM",
      ruta: "Ruta 4 → En tiempo",
      estado: "active",
      alertas: 0,
      velocidad: "42 km/h",
      telefono: "+51 999 456 789"
    },
    {
      id: "BUS-005",
      conductor: "Roberto Silva",
      tiempo: "08:43 AM",
      ruta: "Ruta 5 → Velocidad alta",
      estado: "warning",
      alertas: 1,
      velocidad: "65 km/h",
      telefono: "+51 999 567 890"
    }
  ];

  // Usamos buses pasados como prop o buses de prueba
  const busesToShow = buses.length > 0 ? buses : testBuses;

  // Mock de posiciones GPS para los buses (en un caso real vendrían del backend)
  // Limitamos a solo 5 marcadores y posiciones fijas para consistencia
  const busesWithCoordinates = busesToShow.slice(0, 5).map((bus, index) => {
    const positions = [
      { lat: -12.046373, lng: -77.042755 }, // Centro de Lima
      { lat: -12.056373, lng: -77.052755 }, // Miraflores
      { lat: -12.036373, lng: -77.032755 }, // San Isidro
      { lat: -12.066373, lng: -77.062755 }, // Barranco
      { lat: -12.026373, lng: -77.022755 }  // Magdalena
    ];
    
    return {
      ...bus,
      lat: positions[index]?.lat || defaultCenter.lat,
      lng: positions[index]?.lng || defaultCenter.lng
    };
  });
  
  console.log('GoogleMap - Buses recibidos:', buses.length);
  console.log('GoogleMap - Buses a mostrar:', busesToShow.length);
  console.log('GoogleMap - isLoaded:', isLoaded);
  console.log('GoogleMap - busesWithCoordinates:', busesWithCoordinates);

  const onLoad = useCallback((map) => {
    console.log('Google Maps cargado correctamente');
    setMap(map);
    
    // Esperar a que el mapa esté completamente inicializado - SOLO UNA VEZ
    const enableMarkers = () => {
      if (!markersInitialized && map && window.google && window.google.maps) {
        setMarkersInitialized(true);
        setIsLoaded(true);
        console.log('Marcadores habilitados - SOLO UNA VEZ');
      } else if (!markersInitialized) {
        console.log('Esperando inicialización completa...');
        setTimeout(enableMarkers, 300);
      }
    };
    
    // Un solo intento con tiempo suficiente
    setTimeout(enableMarkers, 500);
  }, [markersInitialized]);

  const onUnmount = useCallback(() => {
    setMap(null);
    setIsLoaded(false);
    setMarkersInitialized(false);
    setSelectedBus(null); // Limpiar InfoWindow al desmontar
    console.log('Google Maps desmontado');
  }, []);

  const handleMarkerClick = (bus) => {
    console.log('Marker clicked:', bus.id);
    
    // Limpiar cualquier InfoWindow existente primero
    setSelectedBus(null);
    
    // Luego establecer el nuevo bus después de un pequeño delay
    setTimeout(() => {
      setSelectedBus(bus);
    }, 50);
    
    // También ejecutar el callback del padre si existe
    if (onBusClick) {
      onBusClick(bus);
    }
  };

  const getBusIcon = (bus) => {
    let color = '#10B981'; // Verde por defecto
    
    switch (bus.estado) {
      case 'active':
        color = '#10B981'; // Verde
        break;
      case 'warning':
        color = '#F59E0B'; // Amarillo
        break;
      case 'error':
        color = '#EF4444'; // Rojo
        break;
      default:
        color = '#6B7280'; // Gris
    }

    // Crear SVG de un bus más realista y visible
    const svgMarker = {
      path: "M -8,-16 L 8,-16 L 8,-8 C 8,-6 6,-4 4,-4 L 2,-4 C 2,-2 0,0 -2,0 C -4,0 -6,-2 -6,-4 L -8,-4 C -10,-4 -12,-6 -12,-8 L -12,-16 Z M -6,-14 L -2,-14 L -2,-10 L -6,-10 Z M 2,-14 L 6,-14 L 6,-10 L 2,-10 Z",
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#FFFFFF',
      scale: 1.8,
      anchor: { x: 0, y: 0 }
    };

    return svgMarker;
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'active': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'active': return 'En Ruta';
      case 'warning': return 'Con Retraso';
      case 'error': return 'Fuera de Ruta';
      default: return 'Desconocido';
    }
  };

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <Box 
        w="100%" 
        h="100%" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg={useColorModeValue('gray.50', '#2a2f3a')}
        borderRadius="xl"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
      >
        <VStack spacing={4}>
          <MapPin size={48} color={useColorModeValue('#9CA3AF', '#6B7280')} />
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.300')}>
              Google Maps API Key requerida
            </Text>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
              Configure VITE_GOOGLE_MAPS_API_KEY en el archivo .env
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="100%" h="100%" position="relative">
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          console.log('LoadScript onLoad ejecutado - Google Maps API cargada');
          // No setear isLoaded aquí, esperar al onLoad del mapa
        }}
        onError={(error) => {
          console.error('Error loading Google Maps:', error);
          setIsLoaded(false);
        }}
        loadingElement={
          <Center h="100%" w="100%">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
                Cargando Google Maps...
              </Text>
              <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')}>
                API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Configurada' : 'NO CONFIGURADA'}
              </Text>
            </VStack>
          </Center>
        }
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: isDarkMode ? darkMapStyles : lightMapStyles,
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            scaleControl: false,
            rotateControl: false,
            // Configuraciones adicionales para limpiar el mapa
            clickableIcons: false, // Deshabilita clicks en POIs
            gestureHandling: 'greedy',
            // Restricciones de zoom para mantener el mapa enfocado en la ciudad
            restriction: {
              latLngBounds: {
                north: -11.8,
                south: -12.3,
                west: -77.3,
                east: -76.8
              },
              strictBounds: false,
            },
            minZoom: 10,
            maxZoom: 18
          }}
        >

          {/* Marcadores de buses - usando icono personalizado */}
          {isLoaded && busesWithCoordinates.map((bus, index) => {
            console.log('Renderizando marcador:', bus.id, 'en posición:', bus.lat, bus.lng);
            
            return (
              <Marker
                key={bus.id}
                position={{ lat: bus.lat, lng: bus.lng }}
                onClick={() => handleMarkerClick(bus)}
                title={`${bus.id} - ${bus.conductor}`}
                icon={{
                  url: './assets/icons/ic_bus_128.png',
                  scaledSize: { width: 32, height: 32 },
                  anchor: { x: 16, y: 16 } // Centrar el icono
                }}
                label={{
                  text: (index + 1).toString(),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              />
            );
          })}

          {/* InfoWindow para bus seleccionado */}
          {isLoaded && selectedBus && selectedBus.id && (() => {
            // Calcular las coordenadas usando la misma lógica que los marcadores
            const busIndex = busesToShow.slice(0, 5).findIndex(b => b.id === selectedBus.id);
            if (busIndex === -1) return null; // No renderizar si no se encuentra el bus
            
            const positions = [
              { lat: -12.046373, lng: -77.042755 }, // Centro de Lima
              { lat: -12.056373, lng: -77.052755 }, // Miraflores
              { lat: -12.036373, lng: -77.032755 }, // San Isidro
              { lat: -12.066373, lng: -77.062755 }, // Barranco
              { lat: -12.026373, lng: -77.022755 }  // Magdalena
            ];
            const position = positions[busIndex];
            
            console.log('Renderizando InfoWindow para:', selectedBus.id, 'en posición:', position);
            
            // Ajustar la posición para que aparezca arriba del marcador
            const infoWindowPosition = {
              lat: position.lat + 0.001, // Mover solo 0.001 grados hacia arriba
              lng: position.lng
            };
            
            return (
              <InfoWindow
                position={infoWindowPosition}
                onCloseClick={() => {
                  console.log('Cerrando InfoWindow');
                  setSelectedBus(null);
                }}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -15) // Offset más pequeño hacia arriba
                }}
              >
                <Box p={2} maxW="280px">
                  <VStack spacing={3} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="center">
                      <Text fontSize="md" fontWeight="bold" color="gray.800">
                        {selectedBus.id}
                      </Text>
                      <Badge colorScheme={getStatusColor(selectedBus.estado)} size="sm">
                        {getStatusText(selectedBus.estado)}
                      </Badge>
                    </HStack>

                    {/* Info básica */}
                    <VStack spacing={1} align="start" fontSize="sm" color="gray.600">
                      <Text><strong>Conductor:</strong> {selectedBus.conductor}</Text>
                      <Text><strong>Ruta:</strong> {selectedBus.ruta}</Text>
                      <Text><strong>Velocidad:</strong> {selectedBus.velocidad}</Text>
                      <Text><strong>Último reporte:</strong> {selectedBus.tiempo}</Text>
                      {selectedBus.alertas > 0 && (
                        <Text color="red.500"><strong>Alertas:</strong> {selectedBus.alertas}</Text>
                      )}
                    </VStack>

                    {/* Botones de acción */}
                    <HStack spacing={2} justify="center">
                      <Button
                        size="xs"
                        colorScheme="green"
                        leftIcon={<Phone size={12} />}
                        onClick={() => {
                          console.log('Llamar a:', selectedBus.conductor);
                          setSelectedBus(null);
                        }}
                      >
                        Llamar
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="blue"
                        leftIcon={<MessageCircle size={12} />}
                        onClick={() => {
                          console.log('Mensaje a:', selectedBus.conductor);
                          setSelectedBus(null);
                        }}
                      >
                        Mensaje
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="purple"
                        leftIcon={<Camera size={12} />}
                        onClick={() => {
                          console.log('Foto de:', selectedBus.id);
                          setSelectedBus(null);
                        }}
                      >
                        Foto
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </InfoWindow>
            );
          })()}

        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default GoogleMapComponent;