// GPS Fleet Monitoring - Camera Configuration
// Configure available cameras for each vehicle

export const cameraConfig = {
  // Default cameras available for all vehicles
  defaultCameras: [
    {
      id: 'front',
      name: 'Cámara Frontal',
      description: 'Vista frontal del vehículo',
      icon: '📹',
      position: 'front',
      quality: 'HD',
      hasNightVision: true,
      isDefault: true
    },
    {
      id: 'interior',
      name: 'Cámara Interior',
      description: 'Vista interior del habitáculo',
      icon: '📷',
      position: 'interior',
      quality: 'HD',
      hasAudio: true,
      isDefault: true
    },
    {
      id: 'rear',
      name: 'Cámara Trasera',
      description: 'Vista trasera del vehículo',
      icon: '🎥',
      position: 'rear',
      quality: 'HD',
      hasNightVision: true,
      isDefault: true
    },
    {
      id: 'dashboard',
      name: 'Cámara Dashboard',
      description: 'Vista del tablero y conductor',
      icon: '🖥️',
      position: 'dashboard',
      quality: 'Full HD',
      hasAudio: true,
      isDefault: true
    }
  ],

  // Optional additional cameras (can be enabled per vehicle)
  optionalCameras: [
    {
      id: 'left_side',
      name: 'Cámara Lateral Izquierda',
      description: 'Vista lateral izquierda',
      icon: '📹',
      position: 'left',
      quality: 'HD',
      hasNightVision: false,
      isDefault: false
    },
    {
      id: 'right_side',
      name: 'Cámara Lateral Derecha',
      description: 'Vista lateral derecha',
      icon: '📹',
      position: 'right',
      quality: 'HD',
      hasNightVision: false,
      isDefault: false
    },
    {
      id: 'roof',
      name: 'Cámara Panorámica',
      description: 'Vista panorámica superior',
      icon: '🌐',
      position: 'roof',
      quality: '4K',
      hasNightVision: true,
      isDefault: false
    },
    {
      id: 'engine',
      name: 'Cámara Motor',
      description: 'Vista del compartimento del motor',
      icon: '🔧',
      position: 'engine',
      quality: 'HD',
      hasNightVision: false,
      isDefault: false
    }
  ],

  // Settings
  settings: {
    maxCamerasPerVehicle: 6,
    defaultImageFormat: 'JPEG',
    defaultQuality: 85,
    captureTimeout: 10000, // 10 seconds
    retryAttempts: 3,
    enableGPS: true,
    enableTimestamp: true,
    enableWatermark: true
  },

  // Vehicle-specific camera configurations
  vehicleConfigurations: {
    // Example: specific configuration for bus type
    'bus_standard': {
      enabledCameras: ['front', 'interior', 'rear', 'dashboard'],
      disabledCameras: []
    },
    'bus_premium': {
      enabledCameras: ['front', 'interior', 'rear', 'dashboard', 'left_side', 'right_side'],
      disabledCameras: []
    },
    'van_delivery': {
      enabledCameras: ['front', 'rear', 'dashboard'],
      disabledCameras: ['interior']
    }
  }
};

// Helper functions
export const getCamerasForVehicle = (vehicleType = 'bus_standard') => {
  const config = cameraConfig.vehicleConfigurations[vehicleType] || 
                 cameraConfig.vehicleConfigurations['bus_standard'];
  
  const allCameras = [...cameraConfig.defaultCameras, ...cameraConfig.optionalCameras];
  
  return allCameras.filter(camera => 
    config.enabledCameras.includes(camera.id) && 
    !config.disabledCameras.includes(camera.id)
  );
};

export const getDefaultCameras = () => {
  return cameraConfig.defaultCameras.filter(camera => camera.isDefault);
};

export const getCameraById = (cameraId) => {
  const allCameras = [...cameraConfig.defaultCameras, ...cameraConfig.optionalCameras];
  return allCameras.find(camera => camera.id === cameraId);
};

export const getCameraSettings = () => {
  return cameraConfig.settings;
};

export default cameraConfig;