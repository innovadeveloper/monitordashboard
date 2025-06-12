# API Endpoints - Sistema de Localización GPS

## Base URL
```
https://api.monitoring-system.com/v1
```

## Autenticación
Todos los endpoints requieren autenticación via JWT token en el header:
```
Authorization: Bearer {token}
```

## Endpoints del Localizador

### 1. Obtener Lista de Buses

**GET** `/buses`

**Query Parameters:**
- `estado` (opcional): Filtrar por estado (active, warning, error, offline)
- `ruta` (opcional): Filtrar por ruta específica
- `conductor` (opcional): Buscar por nombre de conductor
- `limite` (opcional): Número máximo de resultados (default: 50)
- `pagina` (opcional): Página de resultados (default: 1)

**Response:** Ver `assets/examples/buses-response.json`

### 2. Obtener Bus Específico

**GET** `/buses/{id}`

**Path Parameters:**
- `id`: ID del bus (ej: BUS-1565)

**Response:**
```json
{
  "success": true,
  "bus": {
    "id": "BUS-1565",
    "conductor": "Juan Pérez",
    // ... resto de datos del bus
  }
}
```

### 3. Historial de Posiciones

**GET** `/buses/{id}/historial`

**Query Parameters:**
- `fecha_inicio`: Fecha inicio en formato ISO 8601
- `fecha_fin`: Fecha fin en formato ISO 8601
- `intervalo` (opcional): Intervalo en minutos (default: 15)

**Response:** Ver `assets/examples/historial-posiciones.json`

### 4. Obtener Alertas

**GET** `/alertas`

**Query Parameters:**
- `severidad` (opcional): Filtrar por severidad (alta, media, baja)
- `resuelto` (opcional): true/false para filtrar alertas resueltas
- `bus_id` (opcional): Filtrar por bus específico
- `limite` (opcional): Número máximo de resultados

**Response:** Ver `assets/examples/alertas-response.json`

### 5. Realizar Llamada

**POST** `/buses/{id}/llamar`

**Request Body:**
```json
{
  "duracion_maxima": 300,
  "mensaje_previo": "El supervisor desea hablar contigo"
}
```

**Response:** Ver `comandos-response.json` sección "llamada"

### 6. Enviar Mensaje TTS

**POST** `/buses/{id}/mensaje`

**Request Body:**
```json
{
  "mensaje": "Por favor, reduzca la velocidad",
  "volumen": 80,
  "idioma": "es-PE",
  "prioridad": "alta"
}
```

**Response:** Ver `comandos-response.json` sección "mensaje_tts"

### 7. Solicitar Fotos

**POST** `/buses/{id}/foto`

**Request Body:**
```json
{
  "camaras": ["frontal", "lateral_derecha", "trasera"],
  "calidad": "alta",
  "incluir_timestamp": true,
  "incluir_ubicacion": true
}
```

**Response:** Ver `comandos-response.json` sección "solicitar_foto"

### 8. Actualizar Estado de Bus

**PUT** `/buses/{id}/estado`

**Request Body:**
```json
{
  "estado": "active",
  "motivo": "Reanudación de servicio",
  "ubicacion_actual": {
    "lat": -12.046373,
    "lng": -77.042755
  }
}
```

### 9. Configurar Rutas

**GET** `/rutas`

**Response:**
```json
{
  "success": true,
  "rutas": [
    {
      "id": "RUTA-001",
      "nombre": "Ruta 1 → Terminal Norte",
      "activa": true,
      "buses_asignados": ["BUS-1565", "BUS-7943"]
    }
  ]
}
```

### 10. Obtener Estadísticas

**GET** `/estadisticas`

**Query Parameters:**
- `periodo`: día, semana, mes, año
- `fecha_inicio`: Fecha inicio del período
- `fecha_fin`: Fecha fin del período

**Response:**
```json
{
  "success": true,
  "periodo": "día",
  "fecha": "2024-12-06",
  "estadisticas": {
    "buses_activos": 5,
    "buses_total": 8,
    "alertas_activas": 3,
    "distancia_total": "1,245.6 km",
    "tiempo_operacion": "18h 30m",
    "eficiencia_combustible": "5.8 km/l",
    "cumplimiento_horarios": "92%"
  }
}
```

## Códigos de Respuesta

- **200**: OK - Solicitud exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Error en los parámetros
- **401**: Unauthorized - Token inválido o faltante
- **403**: Forbidden - Sin permisos para el recurso
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor
- **503**: Service Unavailable - Servicio temporalmente no disponible

## Códigos de Error Específicos

```json
{
  "success": false,
  "error": {
    "codigo": "DEVICE_OFFLINE",
    "mensaje": "El dispositivo está desconectado",
    "detalles": "Última conexión: 2024-12-06T14:15:00Z"
  }
}
```

**Códigos de Error Comunes:**
- `DEVICE_OFFLINE`: Dispositivo desconectado
- `INVALID_COORDINATES`: Coordenadas inválidas
- `COMMAND_TIMEOUT`: Comando expiró
- `INSUFFICIENT_BATTERY`: Batería insuficiente del dispositivo
- `SIGNAL_WEAK`: Señal débil del dispositivo
- `ROUTE_NOT_FOUND`: Ruta no encontrada
- `UNAUTHORIZED_COMMAND`: Comando no autorizado

## Rate Limiting

- Máximo 1000 requests por hora por token
- Máximo 10 comandos (llamadas/mensajes/fotos) por minuto por bus
- Headers de respuesta incluyen límites actuales:
  ```
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: 1701866400
  ```

## WebSocket para Tiempo Real

**Conexión:**
```javascript
ws://api.monitoring-system.com/v1/ws?token={jwt_token}
```

**Eventos de Tiempo Real:**
- `bus_position_update`: Actualización de posición
- `bus_status_change`: Cambio de estado del bus
- `new_alert`: Nueva alerta generada
- `alert_resolved`: Alerta resuelta
- `device_connection`: Dispositivo conectado/desconectado