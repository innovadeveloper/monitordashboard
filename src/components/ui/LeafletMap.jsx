import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const LeafletMap = ({ buses, onBusClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize map only once
    if (!mapInstance.current) {
      // Centro de Lima, Peru
      mapInstance.current = window.L.map(mapRef.current, {
        zoomControl: false // Disable default zoom control
      }).setView([-12.0464, -77.0428], 13);

      // Add zoom control in bottom left position
      window.L.control.zoom({
        position: 'bottomleft'
      }).addTo(mapInstance.current);

      // Add OpenStreetMap tile layer
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstance.current);

      // Define Lima route coordinates (example route through main avenues)
      const limaRoute = [
        [-12.0464, -77.0428], // Plaza de Armas
        [-12.0520, -77.0437], // Av. Abancay
        [-12.0580, -77.0445], // Av. Grau
        [-12.0640, -77.0453], // Hacia La Victoria
        [-12.0700, -77.0461], // Av. México
        [-12.0760, -77.0469], // Puente Ricardo Palma
        [-12.0820, -77.0477], // San Luis
        [-12.0880, -77.0485], // Ate
        [-12.0940, -77.0493], // Santa Anita
        [-12.1000, -77.0501]  // Final de ruta
      ];

      // Add polyline for the bus route
      const routeLine = window.L.polyline(limaRoute, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(mapInstance.current);

      // Add route markers
      const startIcon = window.L.divIcon({
        html: '<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const endIcon = window.L.divIcon({
        html: '<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      window.L.marker(limaRoute[0], { icon: startIcon })
        .addTo(mapInstance.current)
        .bindPopup('Inicio de Ruta - Plaza de Armas');

      window.L.marker(limaRoute[limaRoute.length - 1], { icon: endIcon })
        .addTo(mapInstance.current)
        .bindPopup('Final de Ruta - Santa Anita');

      // Fit map to route bounds
      mapInstance.current.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    }

    // Clear existing bus markers
    Object.values(markersRef.current).forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = {};

    // Add bus markers
    buses.forEach((bus, index) => {
      // Distribute buses along the route
      const routeProgress = (index / (buses.length - 1)) || 0;
      const routeIndex = Math.floor(routeProgress * 9); // 0-9 for 10 route points
      
      // Base coordinates on route with some random offset
      const baseLat = -12.0464 - (routeIndex * 0.0056);
      const baseLng = -77.0428 - (routeIndex * 0.0008);
      
      // Add small random offset to avoid overlapping
      const lat = baseLat + (Math.random() - 0.5) * 0.002;
      const lng = baseLng + (Math.random() - 0.5) * 0.002;

      // Create custom bus icon
      const busColor = bus.estado === 'active' ? '#22c55e' : 
                       bus.estado === 'warning' ? '#f59e0b' : '#ef4444';

      const busIcon = window.L.divIcon({
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="
              background-color: ${busColor}; 
              width: 24px; 
              height: 24px; 
              border-radius: 4px; 
              border: 2px solid white; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
            ">🚌</div>
            <div style="
              position: absolute;
              top: -8px;
              left: 50%;
              transform: translateX(-50%);
              background: white;
              padding: 1px 4px;
              border-radius: 3px;
              font-size: 10px;
              font-weight: bold;
              color: #374151;
              border: 1px solid #d1d5db;
              white-space: nowrap;
              box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            ">${bus.id}</div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = window.L.marker([lat, lng], { icon: busIcon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: bold;">
              ${bus.id}
            </h3>
            <p style="margin: 4px 0; color: #4b5563; font-size: 12px;">
              <strong>Conductor:</strong> ${bus.conductor}
            </p>
            <p style="margin: 4px 0; color: #4b5563; font-size: 12px;">
              <strong>Ruta:</strong> ${bus.ruta}
            </p>
            <p style="margin: 4px 0; color: #4b5563; font-size: 12px;">
              <strong>Último reporte:</strong> ${bus.tiempo}
            </p>
            <div style="margin-top: 8px; padding: 4px 8px; border-radius: 4px; background-color: ${busColor}20; color: ${busColor}; font-size: 11px; font-weight: bold; text-align: center;">
              ${bus.estado === 'active' ? 'En Ruta' : 
                bus.estado === 'warning' ? 'Con Retraso' : 'Fuera de Ruta'}
            </div>
          </div>
        `);

      // Add click event
      marker.on('click', () => {
        if (onBusClick) {
          onBusClick(bus);
        }
      });

      markersRef.current[bus.id] = marker;
    });

  }, [buses, onBusClick]);

  return (
    <Box
      ref={mapRef}
      w="100%"
      h="100%"
      borderRadius="lg"
      overflow="hidden"
    />
  );
};

export default LeafletMap;