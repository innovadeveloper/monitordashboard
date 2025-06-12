# Estructuras de Datos - Localizador GPS

## Documentación de Formatos JSON Requeridos

### 1. Bus/Vehículo (Estructura Principal)

```json
{
  "id": "BUS-1565",
  "conductor": "Juan Pérez",
  "tiempo": "08:34 AM",
  "ruta": "Ruta 1 → Terminal Norte",
  "estado": "active",
  "alertas": 0,
  "velocidad": "45 km/h",
  "telefono": "+51 999 123 456",
  "fotos": [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
  ],
  "coordenadas": {
    "lat": -12.046373,
    "lng": -77.042755
  },
  "dispositivo": {
    "imei": "123456789012345",
    "bateria": 85,
    "senal": 4
  },
  "fechaActualizacion": "2024-12-06T15:34:20Z"
}
```

### 2. Estados de Bus Permitidos

```json
{
  "estados": {
    "active": {
      "descripcion": "En Ruta",
      "color": "#10B981",
      "icono": "bus-activo"
    },
    "warning": {
      "descripcion": "Con Retraso",
      "color": "#F59E0B",
      "icono": "bus-warning"
    },
    "error": {
      "descripcion": "Fuera de Ruta",
      "color": "#EF4444",
      "icono": "bus-error"
    },
    "offline": {
      "descripcion": "Sin Conexión",
      "color": "#6B7280",
      "icono": "bus-offline"
    }
  }
}
```

### 3. Array de Buses (Endpoint Principal)

```json
{
  "success": true,
  "timestamp": "2024-12-06T15:34:20Z",
  "total": 5,
  "buses": [
    {
      "id": "BUS-1565",
      "conductor": "Juan Pérez",
      "tiempo": "08:34 AM",
      "ruta": "Ruta 1 → Terminal Norte",
      "estado": "active",
      "alertas": 0,
      "velocidad": "45 km/h",
      "telefono": "+51 999 123 456",
      "coordenadas": {
        "lat": -12.046373,
        "lng": -77.042755
      }
    },
    {
      "id": "BUS-1357",
      "conductor": "María González",
      "tiempo": "08:22 AM",
      "ruta": "Ruta 2 → Con retraso",
      "estado": "warning",
      "alertas": 1,
      "velocidad": "38 km/h",
      "telefono": "+51 999 234 567",
      "coordenadas": {
        "lat": -12.056373,
        "lng": -77.052755
      }
    }
  ]
}
```

### 4. Historial de Posiciones

```json
{
  "busId": "BUS-1565",
  "fechaInicio": "2024-12-06T00:00:00Z",
  "fechaFin": "2024-12-06T23:59:59Z",
  "posiciones": [
    {
      "timestamp": "2024-12-06T08:00:00Z",
      "lat": -12.046373,
      "lng": -77.042755,
      "velocidad": "45 km/h",
      "rumbo": 180,
      "evento": "inicio_ruta"
    },
    {
      "timestamp": "2024-12-06T08:15:00Z",
      "lat": -12.048373,
      "lng": -77.044755,
      "velocidad": "52 km/h",
      "rumbo": 185,
      "evento": "en_ruta"
    }
  ]
}
```

### 5. Alertas del Sistema

```json
{
  "busId": "BUS-1565",
  "alertas": [
    {
      "id": "ALT-001",
      "tipo": "velocidad_alta",
      "mensaje": "Velocidad excesiva detectada: 75 km/h",
      "timestamp": "2024-12-06T15:30:00Z",
      "severidad": "alta",
      "coordenadas": {
        "lat": -12.046373,
        "lng": -77.042755
      },
      "resuelto": false
    },
    {
      "id": "ALT-002",
      "tipo": "fuera_ruta",
      "mensaje": "Vehículo fuera de ruta asignada",
      "timestamp": "2024-12-06T14:45:00Z",
      "severidad": "media",
      "coordenadas": {
        "lat": -12.050373,
        "lng": -77.048755
      },
      "resuelto": true
    }
  ]
}
```

### 6. Configuración de Rutas

```json
{
  "rutas": [
    {
      "id": "RUTA-001",
      "nombre": "Ruta 1 → Terminal Norte",
      "descripcion": "Ruta principal centro-norte",
      "puntos": [
        {
          "orden": 1,
          "nombre": "Terminal Central",
          "lat": -12.046373,
          "lng": -77.042755,
          "tipo": "terminal"
        },
        {
          "orden": 2,
          "nombre": "Plaza San Martín",
          "lat": -12.048373,
          "lng": -77.044755,
          "tipo": "parada"
        },
        {
          "orden": 3,
          "nombre": "Terminal Norte",
          "lat": -12.036373,
          "lng": -77.032755,
          "tipo": "terminal"
        }
      ],
      "horarios": {
        "inicio": "05:00",
        "fin": "23:00",
        "frecuencia": 15
      }
    }
  ]
}
```

### 7. Respuesta de Comandos (Llamadas, Mensajes)

```json
{
  "comando": {
    "tipo": "llamada",
    "busId": "BUS-1565",
    "timestamp": "2024-12-06T15:34:20Z",
    "parametros": {
      "duracion": 120,
      "numero": "+51 999 123 456"
    },
    "estado": "completado",
    "respuesta": {
      "exitoso": true,
      "mensaje": "Llamada realizada con éxito",
      "duracion_real": 118
    }
  }
}
```

### 8. Filtros de Búsqueda

```json
{
  "filtros": {
    "estado": ["active", "warning", "error"],
    "ruta": "all",
    "conductor": "",
    "busId": "",
    "fechaDesde": "2024-12-06T00:00:00Z",
    "fechaHasta": "2024-12-06T23:59:59Z",
    "alertasMinimas": 0,
    "velocidadMin": 0,
    "velocidadMax": 80
  }
}
```

## Endpoints Recomendados

### GET /api/buses
Obtiene lista de todos los buses activos

### GET /api/buses/{id}
Obtiene información detallada de un bus específico

### GET /api/buses/{id}/historial
Obtiene historial de posiciones de un bus

### POST /api/buses/{id}/llamar
Inicia llamada a un bus específico

### POST /api/buses/{id}/mensaje
Envía mensaje TTS a un bus

### POST /api/buses/{id}/foto
Solicita foto de las cámaras del bus

### GET /api/alertas
Obtiene alertas del sistema

### GET /api/rutas
Obtiene configuración de rutas

## Notas de Implementación

1. **Coordenadas**: Usar formato decimal (lat, lng) en grados
2. **Timestamps**: Formato ISO 8601 (UTC)
3. **Estados**: Usar valores predefinidos para consistencia
4. **Fotos**: URLs absolitas o rutas relativas válidas
5. **Teléfonos**: Formato internacional con código de país
6. **Velocidades**: Incluir unidad (km/h)
7. **IDs**: Usar formato consistente (BUS-XXXX, ALT-XXX, etc.)