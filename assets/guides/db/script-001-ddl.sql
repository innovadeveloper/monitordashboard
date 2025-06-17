-- ========================================
-- SISTEMA DE TRANSPORTE URBANO - PostgreSQL
-- Arquitectura: Redis (Geoespacial) + JTS (Validación) + PostgreSQL (Registro)
-- VERSION CORREGIDA SIN SIMBOLOS $ PROBLEMATICOS
-- ========================================

-- Configuración inicial
SET timezone = 'America/Lima';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- MÓDULO DE USUARIOS (LDAP)
-- ========================================

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    ldap_uid VARCHAR(50) UNIQUE NOT NULL,
    dni VARCHAR(8) UNIQUE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('CONDUCTOR', 'ADMINISTRADOR', 'MONITOREADOR')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_ldap_uid ON user_profiles(ldap_uid);
CREATE INDEX idx_profiles_type_active ON user_profiles(user_type, is_active);

COMMENT ON TABLE user_profiles IS 'Perfiles locales vinculados a usuarios LDAP - datos operativos específicos';

CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    user_profile_id INTEGER UNIQUE NOT NULL REFERENCES user_profiles(id),
    driver_license VARCHAR(20) UNIQUE NOT NULL,
    license_type VARCHAR(10) NOT NULL CHECK (license_type IN ('A-IIa', 'A-IIb')),
    license_expiry DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TERMINATED')),
    current_vehicle_id INTEGER, -- Referencia agregada después
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drivers_status_license ON drivers(status, license_expiry);
CREATE INDEX idx_drivers_current_vehicle ON drivers(current_vehicle_id);

-- ========================================
-- MÓDULO DE RUTAS Y VEHÍCULOS
-- ========================================

CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#0066CC',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_polylines (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id),
    name VARCHAR(100) NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('IDA', 'VUELTA', 'BIDIRECCIONAL')),
    
    -- Coordenadas para visualización y validación JTS
    coordinates_json JSONB NOT NULL,
    encoded_polyline TEXT,
    
    -- Configuración visual para mapas
    color VARCHAR(7),
    stroke_width INTEGER DEFAULT 4,
    stroke_opacity DECIMAL(3,2) DEFAULT 0.8,
    
    -- Metadatos calculados
    total_distance_km DECIMAL(6,2),
    estimated_time_minutes INTEGER,
    
    -- Para validación de desvíos con JTS
    corridor_width_meters INTEGER DEFAULT 100,
    deviation_tolerance_meters INTEGER DEFAULT 50,
    
    -- Control de sincronización con Redis/JTS
    geometry_hash VARCHAR(64),
    config_hash VARCHAR(64),
    jts_cached_at TIMESTAMP,
    redis_synced_at TIMESTAMP,
    redis_sync_key VARCHAR(100),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_profile_id INTEGER REFERENCES user_profiles(id)
);

CREATE INDEX idx_polylines_route_direction ON route_polylines(route_id, direction, is_active);
CREATE INDEX idx_polylines_sync_status ON route_polylines(is_active, redis_synced_at);
CREATE INDEX idx_polylines_redis_key ON route_polylines(redis_sync_key);
CREATE INDEX idx_polylines_hashes ON route_polylines(geometry_hash, config_hash);

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    plate_number VARCHAR(10) UNIQUE NOT NULL,
    internal_code VARCHAR(20) UNIQUE NOT NULL,
    route_id INTEGER REFERENCES routes(id),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar FK a drivers después de crear vehicles
ALTER TABLE drivers ADD CONSTRAINT fk_drivers_current_vehicle 
    FOREIGN KEY (current_vehicle_id) REFERENCES vehicles(id);

CREATE TABLE trackers (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id INTEGER REFERENCES vehicles(id),
    posting_interval INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ERROR')),
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- GEOCERCAS - CONFIGURACIÓN MASTER
-- ========================================

CREATE TABLE geofence_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    default_alert_priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (default_alert_priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    color VARCHAR(7) DEFAULT '#FF0000',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar tipos básicos
INSERT INTO geofence_types (name, display_name, default_alert_priority, color) VALUES
('BUS_STOP', 'Paradero de Bus', 'MEDIUM', '#0066CC'),
('TERMINAL', 'Terminal', 'HIGH', '#FF6600'),
('SPEED_ZONE', 'Zona de Velocidad', 'HIGH', '#FF0000'),
('ROUTE_CORRIDOR', 'Corredor de Ruta', 'MEDIUM', '#00CC66');

CREATE TABLE geofences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    geofence_type_id INTEGER REFERENCES geofence_types(id),
    route_id INTEGER REFERENCES routes(id),
    
    -- Geometría simple para Redis sync
    geometry_type VARCHAR(20) NOT NULL CHECK (geometry_type IN ('CIRCLE', 'POLYGON')),
    center_latitude DECIMAL(10,8),
    center_longitude DECIMAL(11,8),
    radius_meters INTEGER,
    coordinates_json JSONB,
    
    -- Configuración de alertas (se sincroniza a Redis)
    alert_on_entry BOOLEAN DEFAULT false,
    alert_on_exit BOOLEAN DEFAULT true,
    alert_on_dwell BOOLEAN DEFAULT false,
    max_dwell_seconds INTEGER DEFAULT 300,
    alert_priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (alert_priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    
    -- Configuración de velocidad
    max_speed_kmh INTEGER,
    min_speed_kmh INTEGER,
    speed_alert_enabled BOOLEAN DEFAULT true,
    speed_tolerance_kmh INTEGER DEFAULT 5,
    
    -- Configuración operativa
    applies_to_routes JSONB,
    
    -- Control de sincronización con Redis
    config_hash VARCHAR(64),
    redis_sync_key VARCHAR(100),
    redis_synced_at TIMESTAMP,
    jts_cached_at TIMESTAMP,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_profile_id INTEGER REFERENCES user_profiles(id)
);

CREATE INDEX idx_geofences_type_active ON geofences(geofence_type_id, is_active);
CREATE INDEX idx_geofences_sync_status ON geofences(is_active, redis_synced_at);
CREATE INDEX idx_geofences_redis_key ON geofences(redis_sync_key);
CREATE INDEX idx_geofences_config_hash ON geofences(config_hash);

CREATE TABLE bus_stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    route_id INTEGER REFERENCES routes(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    stop_order INTEGER,
    geofence_id INTEGER REFERENCES geofences(id),
    
    -- Configuración específica del paradero
    is_terminal BOOLEAN DEFAULT false,
    min_stop_seconds INTEGER DEFAULT 30,
    max_stop_seconds INTEGER DEFAULT 300,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stops_route_order ON bus_stops(route_id, stop_order);
CREATE INDEX idx_stops_geofence ON bus_stops(geofence_id);

-- ========================================
-- CONFIGURACIÓN DE VELOCIDAD
-- ========================================

CREATE TABLE speed_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    zone_type VARCHAR(30) NOT NULL,
    
    -- Límites de velocidad
    max_speed_kmh INTEGER NOT NULL,
    warning_speed_kmh INTEGER,
    tolerance_kmh INTEGER DEFAULT 5,
    
    -- Horarios especiales
    has_special_hours BOOLEAN DEFAULT false,
    special_hours_start TIME,
    special_hours_end TIME,
    special_max_speed_kmh INTEGER,
    special_days VARCHAR(7) DEFAULT '1111100',
    
    -- Aplicabilidad
    applies_to_routes JSONB,
    applies_to_vehicle_types JSONB,
    
    -- Configuración de alertas
    alert_priority VARCHAR(10) DEFAULT 'HIGH' CHECK (alert_priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    continuous_violation_threshold_seconds INTEGER DEFAULT 10,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_profile_id INTEGER REFERENCES user_profiles(id)
);

CREATE INDEX idx_speed_zones_type ON speed_zones(zone_type, is_active);
CREATE INDEX idx_speed_zones_speed ON speed_zones(max_speed_kmh);
CREATE INDEX idx_speed_zones_special ON speed_zones(has_special_hours, is_active);

CREATE TABLE route_speed_config (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id),
    segment_name VARCHAR(100),
    
    -- Definición del segmento
    start_reference VARCHAR(200),
    end_reference VARCHAR(200),
    segment_order INTEGER,
    
    -- Límites de velocidad para este tramo específico
    max_speed_kmh INTEGER NOT NULL,
    min_speed_kmh INTEGER DEFAULT 10,
    recommended_speed_kmh INTEGER,
    
    -- Configuración de alertas
    tolerance_kmh INTEGER DEFAULT 5,
    warning_threshold_kmh INTEGER,
    
    -- Condiciones especiales
    weather_conditions JSONB,
    time_restrictions JSONB,
    
    -- Asociación con zona (opcional)
    speed_zone_id INTEGER REFERENCES speed_zones(id),
    override_zone_limits BOOLEAN DEFAULT false,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_route_speed_route_order ON route_speed_config(route_id, segment_order);
CREATE INDEX idx_route_speed_route_active ON route_speed_config(route_id, is_active);
CREATE INDEX idx_route_speed_zone ON route_speed_config(speed_zone_id);

CREATE TABLE global_speed_config (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(50) UNIQUE NOT NULL,
    
    -- Límites globales
    max_speed_kmh INTEGER NOT NULL,
    warning_speed_kmh INTEGER NOT NULL,
    critical_speed_kmh INTEGER,
    
    -- Configuración por tipo de vehículo
    vehicle_type_overrides JSONB,
    
    -- Tolerancias
    gps_accuracy_tolerance_kmh INTEGER DEFAULT 3,
    processing_tolerance_kmh INTEGER DEFAULT 2,
    
    -- Configuración de alertas
    consecutive_violations_threshold INTEGER DEFAULT 3,
    violation_duration_threshold_seconds INTEGER DEFAULT 15,
    
    -- Aplicabilidad
    applies_to_routes JSONB,
    priority_order INTEGER DEFAULT 1,
    
    is_active BOOLEAN DEFAULT true,
    effective_from TIMESTAMP,
    effective_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_profile_id INTEGER REFERENCES user_profiles(id)
);

CREATE INDEX idx_global_speed_config_name ON global_speed_config(config_name, is_active);
CREATE INDEX idx_global_speed_priority ON global_speed_config(priority_order, is_active);
CREATE INDEX idx_global_speed_effective ON global_speed_config(effective_from, effective_until);

-- Insertar configuraciones por defecto
INSERT INTO global_speed_config (config_name, max_speed_kmh, warning_speed_kmh, critical_speed_kmh, priority_order) VALUES
('DEFAULT_URBAN', 60, 55, 80, 1),
('DEFAULT_HIGHWAY', 90, 85, 120, 2),
('EMERGENCY_MODE', 40, 35, 60, 3);

-- ========================================
-- EVENTOS PROCESADOS - SOLO RESULTADOS
-- ========================================

CREATE TABLE geofence_events (
    id BIGSERIAL PRIMARY KEY,
    geofence_id INTEGER NOT NULL REFERENCES geofences(id),
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    tracker_id INTEGER NOT NULL REFERENCES trackers(id),
    driver_profile_id INTEGER REFERENCES user_profiles(id),
    
    -- Evento procesado
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('ENTRY', 'EXIT', 'DWELL_VIOLATION')),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    speed DECIMAL(5,2),
    heading INTEGER,
    
    -- Timestamps del evento
    event_timestamp TIMESTAMP NOT NULL,
    entry_timestamp TIMESTAMP,
    dwell_seconds INTEGER,
    
    -- Metadatos de procesamiento
    processing_method VARCHAR(20) CHECK (processing_method IN ('REDIS_ONLY', 'REDIS_JTS', 'JTS_VALIDATION')),
    processing_latency_ms INTEGER,
    redis_distance_meters DECIMAL(8,2),
    jts_validation_result BOOLEAN,
    
    -- Estado de alerta
    alert_generated BOOLEAN DEFAULT false,
    alert_priority VARCHAR(10) CHECK (alert_priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by_profile_id INTEGER REFERENCES user_profiles(id),
    acknowledged_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_geofence_events_vehicle_time ON geofence_events(vehicle_id, event_timestamp);
CREATE INDEX idx_geofence_events_fence_time ON geofence_events(geofence_id, event_timestamp);
CREATE INDEX idx_geofence_events_alerts ON geofence_events(event_type, alert_generated);
CREATE INDEX idx_geofence_events_pending ON geofence_events(acknowledged, alert_priority);
CREATE INDEX idx_geofence_events_created ON geofence_events(created_at);

CREATE TABLE bus_stop_events (
    id BIGSERIAL PRIMARY KEY,
    bus_stop_id INTEGER NOT NULL REFERENCES bus_stops(id),
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    driver_profile_id INTEGER REFERENCES user_profiles(id),
    
    -- Datos del evento de paradero
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('ARRIVAL', 'DEPARTURE', 'DWELL_VIOLATION', 'SKIP')),
    arrival_timestamp TIMESTAMP,
    departure_timestamp TIMESTAMP,
    dwell_seconds INTEGER,
    
    -- Datos de posición
    arrival_latitude DECIMAL(10,8),
    arrival_longitude DECIMAL(11,8),
    departure_latitude DECIMAL(10,8),
    departure_longitude DECIMAL(11,8),
    
    -- Cumplimiento de itinerario
    scheduled_arrival TIMESTAMP,
    delay_seconds INTEGER,
    compliance_status VARCHAR(20) CHECK (compliance_status IN ('ON_TIME', 'LATE', 'EARLY', 'SKIPPED')),
    
    -- Metadatos
    processing_source VARCHAR(20) DEFAULT 'GEOFENCE_SYSTEM',
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bus_stop_events_stop_time ON bus_stop_events(bus_stop_id, arrival_timestamp);
CREATE INDEX idx_bus_stop_events_vehicle_time ON bus_stop_events(vehicle_id, arrival_timestamp);
CREATE INDEX idx_bus_stop_events_compliance ON bus_stop_events(compliance_status, created_at);

CREATE TABLE speed_violations (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    tracker_id INTEGER NOT NULL REFERENCES trackers(id),
    driver_profile_id INTEGER REFERENCES user_profiles(id),
    geofence_id INTEGER REFERENCES geofences(id),
    
    -- Datos de la violación
    violation_type VARCHAR(20) NOT NULL CHECK (violation_type IN ('SPEED_LIMIT', 'RECKLESS_DRIVING')),
    recorded_speed DECIMAL(5,2) NOT NULL,
    speed_limit DECIMAL(5,2) NOT NULL,
    excess_speed DECIMAL(5,2) NOT NULL,
    
    -- Ubicación
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    
    -- Duración de la violación
    start_timestamp TIMESTAMP NOT NULL,
    end_timestamp TIMESTAMP,
    duration_seconds INTEGER,
    
    -- Severidad automática
    severity VARCHAR(20) CHECK (severity IN ('MINOR', 'MODERATE', 'SEVERE', 'CRITICAL')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_speed_violations_vehicle_time ON speed_violations(vehicle_id, start_timestamp);
CREATE INDEX idx_speed_violations_severity ON speed_violations(severity, created_at);
CREATE INDEX idx_speed_violations_zone_time ON speed_violations(geofence_id, start_timestamp);

CREATE TABLE route_deviations (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    route_id INTEGER NOT NULL REFERENCES routes(id),
    driver_profile_id INTEGER REFERENCES user_profiles(id),
    
    -- Datos del desvío
    deviation_type VARCHAR(20) NOT NULL CHECK (deviation_type IN ('MINOR_DEVIATION', 'MAJOR_DEVIATION', 'UNAUTHORIZED_ROUTE')),
    start_latitude DECIMAL(10,8) NOT NULL,
    start_longitude DECIMAL(11,8) NOT NULL,
    end_latitude DECIMAL(10,8),
    end_longitude DECIMAL(11,8),
    
    -- Tiempo del desvío
    start_timestamp TIMESTAMP NOT NULL,
    end_timestamp TIMESTAMP,
    duration_seconds INTEGER,
    
    -- Distancia del desvío
    max_deviation_meters DECIMAL(8,2),
    total_deviation_distance DECIMAL(8,2),
    
    -- Estado
    is_authorized BOOLEAN DEFAULT false,
    authorized_by_profile_id INTEGER REFERENCES user_profiles(id),
    authorization_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_route_deviations_vehicle_time ON route_deviations(vehicle_id, start_timestamp);
CREATE INDEX idx_route_deviations_route_time ON route_deviations(route_id, start_timestamp);
CREATE INDEX idx_route_deviations_unauthorized ON route_deviations(is_authorized, duration_seconds);

-- ========================================
-- HISTÓRICO GPS - SOLO PARA REPORTES
-- ========================================

CREATE TABLE location_history (
    id BIGSERIAL PRIMARY KEY,
    tracker_id INTEGER NOT NULL REFERENCES trackers(id),
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    speed DECIMAL(5,2) DEFAULT 0,
    heading INTEGER,
    timestamp TIMESTAMP NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_location_history_vehicle_time ON location_history(vehicle_id, timestamp);
CREATE INDEX idx_location_history_timestamp ON location_history(timestamp);

-- ========================================
-- ALERTAS Y EVENTOS DEL SISTEMA
-- ========================================

CREATE TABLE system_alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    source_table VARCHAR(50),
    source_id BIGINT,
    
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    driver_profile_id INTEGER REFERENCES user_profiles(id),
    
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Estado de la alerta
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED')),
    acknowledged_by_profile_id INTEGER REFERENCES user_profiles(id),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    
    -- Datos adicionales
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_active_priority ON system_alerts(status, priority, created_at);
CREATE INDEX idx_alerts_vehicle_time ON system_alerts(vehicle_id, created_at);
CREATE INDEX idx_alerts_type_time ON system_alerts(alert_type, created_at);

CREATE TABLE panic_alerts (
    id BIGSERIAL PRIMARY KEY,
    tracker_id INTEGER NOT NULL REFERENCES trackers(id),
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    driver_profile_id INTEGER REFERENCES user_profiles(id),
    
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'FALSE_ALARM')),
    priority VARCHAR(10) DEFAULT 'CRITICAL' CHECK (priority IN ('HIGH', 'CRITICAL')),
    
    acknowledged_by_profile_id INTEGER REFERENCES user_profiles(id),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_panic_status_time ON panic_alerts(status, created_at);
CREATE INDEX idx_panic_vehicle_time ON panic_alerts(vehicle_id, created_at);

-- ========================================
-- CONFIGURACIÓN DEL SISTEMA
-- ========================================

CREATE TABLE redis_sync_log (
    id SERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    redis_key VARCHAR(200),
    
    -- Hash para detectar cambios
    old_hash VARCHAR(64),
    new_hash VARCHAR(64),
    change_type VARCHAR(20) CHECK (change_type IN ('CREATE', 'UPDATE', 'DELETE', 'NO_CHANGE')),
    
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PARTIAL')),
    error_message TEXT,
    records_processed INTEGER DEFAULT 0,
    
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    duration_ms INTEGER
);

CREATE TABLE system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'STRING' CHECK (data_type IN ('STRING', 'INTEGER', 'BOOLEAN', 'JSON')),
    
    updated_by_profile_id INTEGER REFERENCES user_profiles(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuraciones iniciales
INSERT INTO system_config (config_key, config_value, description, data_type) VALUES
('REDIS_SYNC_INTERVAL_MINUTES', '5', 'Intervalo de sincronización a Redis en minutos', 'INTEGER'),
('JTS_CACHE_EXPIRY_HOURS', '24', 'Horas de expiración del cache JTS', 'INTEGER'),
('SPEED_ALERT_TOLERANCE_KMH', '5', 'Tolerancia por defecto para alertas de velocidad', 'INTEGER'),
('GEOFENCE_PROCESSING_ENABLED', 'true', 'Habilitar procesamiento de geocercas', 'BOOLEAN'),
('MAX_LOCATION_HISTORY_DAYS', '30', 'Días máximos de historial GPS', 'INTEGER');

-- ========================================
-- VISTAS PARA REPORTES OPTIMIZADOS
-- ========================================

-- Vista consolidada de eventos por vehículo
CREATE VIEW vehicle_events_summary AS
SELECT 
    v.id as vehicle_id,
    v.plate_number,
    v.internal_code,
    r.name as route_name,
    COUNT(ge.id) as total_geofence_events,
    COUNT(CASE WHEN ge.event_type = 'ENTRY' THEN 1 END) as entries,
    COUNT(CASE WHEN ge.event_type = 'EXIT' THEN 1 END) as exits,
    COUNT(sv.id) as speed_violations,
    COUNT(rd.id) as route_deviations,
    MAX(ge.event_timestamp) as last_event_time
FROM vehicles v
LEFT JOIN routes r ON v.route_id = r.id
LEFT JOIN geofence_events ge ON v.id = ge.vehicle_id 
    AND ge.event_timestamp >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN speed_violations sv ON v.id = sv.vehicle_id 
    AND sv.start_timestamp >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN route_deviations rd ON v.id = rd.vehicle_id 
    AND rd.start_timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY v.id, v.plate_number, v.internal_code, r.name;

-- Vista de alertas pendientes
CREATE VIEW pending_alerts AS
SELECT 
    sa.id,
    sa.alert_type,
    sa.priority,
    sa.title,
    sa.description,
    v.plate_number,
    v.internal_code,
    r.name as route_name,
    d.driver_license,
    up.ldap_uid as driver_uid,
    sa.created_at,
    EXTRACT(EPOCH FROM (NOW() - sa.created_at))/60 as minutes_ago
FROM system_alerts sa
JOIN vehicles v ON sa.vehicle_id = v.id
LEFT JOIN routes r ON v.route_id = r.id
LEFT JOIN drivers d ON sa.driver_profile_id = d.user_profile_id
LEFT JOIN user_profiles up ON d.user_profile_id = up.id
WHERE sa.status = 'ACTIVE'
ORDER BY sa.priority DESC, sa.created_at ASC;

-- Vista de rendimiento por conductor
CREATE VIEW driver_performance_summary AS
SELECT 
    d.id as driver_id,
    up.ldap_uid,
    d.driver_license,
    v.plate_number,
    v.internal_code,
    
    -- Eventos últimos 30 días
    COUNT(ge.id) as total_geofence_events,
    COUNT(sv.id) as speed_violations,
    COUNT(rd.id) as route_deviations,
    COUNT(pa.id) as panic_alerts,
    
    -- Alertas generadas
    COUNT(CASE WHEN ge.alert_generated = true THEN 1 END) as alerts_generated,
    COUNT(CASE WHEN sv.severity IN ('SEVERE', 'CRITICAL') THEN 1 END) as serious_violations,
    
    -- Cumplimiento en paraderos
    COUNT(bse.id) as bus_stop_events,
    COUNT(CASE WHEN bse.compliance_status = 'ON_TIME' THEN 1 END) as on_time_arrivals,
    COUNT(CASE WHEN bse.compliance_status = 'LATE' THEN 1 END) as late_arrivals,
    
    -- Métricas calculadas
    CASE 
        WHEN COUNT(bse.id) > 0 THEN 
            ROUND((COUNT(CASE WHEN bse.compliance_status = 'ON_TIME' THEN 1 END) * 100.0 / COUNT(bse.id)), 2)
        ELSE 0 
    END as punctuality_percentage,
    
    -- Última actividad
    MAX(ge.event_timestamp) as last_activity
    
FROM drivers d
JOIN user_profiles up ON d.user_profile_id = up.id
LEFT JOIN vehicles v ON d.current_vehicle_id = v.id
LEFT JOIN geofence_events ge ON d.user_profile_id = ge.driver_profile_id 
    AND ge.event_timestamp >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN speed_violations sv ON d.user_profile_id = sv.driver_profile_id 
    AND sv.start_timestamp >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN route_deviations rd ON d.user_profile_id = rd.driver_profile_id 
    AND rd.start_timestamp >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN panic_alerts pa ON d.user_profile_id = pa.driver_profile_id 
    AND pa.created_at >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN bus_stop_events bse ON d.user_profile_id = bse.driver_profile_id 
    AND bse.arrival_timestamp >= CURRENT_DATE - INTERVAL '30 days'
WHERE d.status = 'ACTIVE'
GROUP BY d.id, up.ldap_uid, d.driver_license, v.plate_number, v.internal_code;

-- Vista de estadísticas por ruta
CREATE VIEW route_statistics AS
SELECT 
    r.id as route_id,
    r.name as route_name,
    r.code as route_code,
    
    -- Vehículos asignados
    COUNT(DISTINCT v.id) as assigned_vehicles,
    COUNT(DISTINCT d.id) as active_drivers,
    
    -- Paraderos
    COUNT(DISTINCT bs.id) as total_bus_stops,
    COUNT(DISTINCT CASE WHEN bs.is_terminal = true THEN bs.id END) as terminals,
    
    -- Eventos últimos 30 días
    COUNT(ge.id) as total_geofence_events,
    COUNT(sv.id) as speed_violations,
    COUNT(rd.id) as route_deviations,
    COUNT(bse.id) as bus_stop_events,
    
    -- Cumplimiento
    COUNT(CASE WHEN bse.compliance_status = 'ON_TIME' THEN 1 END) as on_time_arrivals,
    COUNT(CASE WHEN bse.compliance_status = 'LATE' THEN 1 END) as late_arrivals,
    COUNT(CASE WHEN bse.compliance_status = 'EARLY' THEN 1 END) as early_arrivals,
    
    -- Métricas de calidad
    CASE 
        WHEN COUNT(bse.id) > 0 THEN 
            ROUND((COUNT(CASE WHEN bse.compliance_status = 'ON_TIME' THEN 1 END) * 100.0 / COUNT(bse.id)), 2)
        ELSE 0 
    END as punctuality_percentage,
    
    AVG(bse.delay_seconds) as avg_delay_seconds,
    
    -- Distancia total (suma de polilíneas activas)
    SUM(rp.total_distance_km) as total_distance_km,
    
    -- Última actividad
    MAX(GREATEST(
        COALESCE(ge.event_timestamp, '1900-01-01'::timestamp),
        COALESCE(bse.arrival_timestamp, '1900-01-01'::timestamp)
    )) as last_activity
    
FROM routes r
LEFT JOIN vehicles v ON r.id = v.route_id AND v.status = 'ACTIVE'
LEFT JOIN drivers d ON v.id = d.current_vehicle_id AND d.status = 'ACTIVE'
LEFT JOIN bus_stops bs ON r.id = bs.route_id AND bs.is_active = true
LEFT JOIN route_polylines rp ON r.id = rp.route_id AND rp.is_active = true
LEFT JOIN geofence_events ge ON v.id = ge.vehicle_id 
    AND ge.event_timestamp >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN speed_violations sv ON v.id = sv.vehicle_id 
    AND sv.start_timestamp >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN route_deviations rd ON r.id = rd.route_id 
    AND rd.start_timestamp >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN bus_stop_events bse ON bs.id = bse.bus_stop_id 
    AND bse.arrival_timestamp >= CURRENT_DATE - INTERVAL '30 days'
WHERE r.is_active = true
GROUP BY r.id, r.name, r.code;

-- Vista de configuración de geocercas para sincronización
CREATE VIEW geofences_sync_status AS
SELECT 
    g.id,
    g.name,
    gt.display_name as type_name,
    g.geometry_type,
    g.is_active,
    g.config_hash,
    g.redis_sync_key,
    g.redis_synced_at,
    g.jts_cached_at,
    g.updated_at,
    
    -- Estado de sincronización
    CASE 
        WHEN g.redis_synced_at IS NULL THEN 'NEVER_SYNCED'
        WHEN g.updated_at > g.redis_synced_at THEN 'NEEDS_SYNC'
        WHEN g.redis_synced_at > NOW() - INTERVAL '1 hour' THEN 'SYNCED'
        ELSE 'SYNC_OLD'
    END as sync_status,
    
    -- Estado del cache JTS
    CASE 
        WHEN g.geometry_type = 'CIRCLE' THEN 'NO_JTS_NEEDED'
        WHEN g.jts_cached_at IS NULL THEN 'NEVER_CACHED'
        WHEN g.jts_cached_at < NOW() - INTERVAL '24 hours' THEN 'CACHE_EXPIRED'
        ELSE 'CACHED'
    END as jts_cache_status,
    
    -- Configuración aplicable
    CASE 
        WHEN g.applies_to_routes IS NOT NULL THEN 
            jsonb_array_length(g.applies_to_routes)
        ELSE 0 
    END as applies_to_routes_count
    
FROM geofences g
JOIN geofence_types gt ON g.geofence_type_id = gt.id
ORDER BY g.updated_at DESC;

-- ========================================
-- FUNCIONES AUXILIARES SIN SIMBOLOS PROBLEMATICOS
-- ========================================

-- Función para calcular hash de configuración de geocerca
CREATE OR REPLACE FUNCTION calculate_geofence_config_hash(geofence_id INTEGER)
RETURNS VARCHAR(64) AS 
'DECLARE
    config_data TEXT;
    result_hash VARCHAR(64);
BEGIN
    SELECT CONCAT(
        COALESCE(name, ''''), ''|'',
        COALESCE(geometry_type, ''''), ''|'',
        COALESCE(center_latitude::TEXT, ''''), ''|'',
        COALESCE(center_longitude::TEXT, ''''), ''|'',
        COALESCE(radius_meters::TEXT, ''''), ''|'',
        COALESCE(coordinates_json::TEXT, ''''), ''|'',
        COALESCE(max_speed_kmh::TEXT, ''''), ''|'',
        COALESCE(alert_on_entry::TEXT, ''''), ''|'',
        COALESCE(alert_on_exit::TEXT, ''''), ''|'',
        COALESCE(applies_to_routes::TEXT, '''')
    ) INTO config_data
    FROM geofences 
    WHERE id = geofence_id;
    
    -- Calcular hash MD5 simple
    SELECT UPPER(MD5(config_data)) INTO result_hash;
    
    RETURN result_hash;
END;'
LANGUAGE plpgsql;

-- Función para marcar geocercas que necesitan sincronización
CREATE OR REPLACE FUNCTION mark_geofences_for_sync()
RETURNS INTEGER AS 
'DECLARE
    updated_count INTEGER := 0;
    rec RECORD;
    new_hash VARCHAR(64);
BEGIN
    FOR rec IN 
        SELECT id, config_hash 
        FROM geofences 
        WHERE is_active = true
    LOOP
        new_hash := calculate_geofence_config_hash(rec.id);
        
        IF new_hash != COALESCE(rec.config_hash, '''') THEN
            UPDATE geofences 
            SET config_hash = new_hash,
                redis_synced_at = NULL
            WHERE id = rec.id;
            
            updated_count := updated_count + 1;
        END IF;
    END LOOP;
    
    RETURN updated_count;
END;'
LANGUAGE plpgsql;

-- Función para limpiar datos históricos antiguos
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS TEXT AS 
'DECLARE
    deleted_locations INTEGER;
    deleted_events INTEGER;
    deleted_logs INTEGER;
    retention_days INTEGER;
    result_message TEXT;
BEGIN
    -- Obtener días de retención de configuración
    SELECT config_value::INTEGER INTO retention_days
    FROM system_config 
    WHERE config_key = ''MAX_LOCATION_HISTORY_DAYS'';
    
    IF retention_days IS NULL THEN
        retention_days := 30;
    END IF;
    
    -- Limpiar historial de ubicaciones
    DELETE FROM location_history 
    WHERE timestamp < NOW() - (retention_days || '' days'')::INTERVAL;
    GET DIAGNOSTICS deleted_locations = ROW_COUNT;
    
    -- Limpiar eventos muy antiguos (6 meses)
    DELETE FROM geofence_events 
    WHERE created_at < NOW() - INTERVAL ''6 months'';
    GET DIAGNOSTICS deleted_events = ROW_COUNT;
    
    -- Limpiar logs de sincronización (30 días)
    DELETE FROM redis_sync_log 
    WHERE started_at < NOW() - INTERVAL ''30 days'';
    GET DIAGNOSTICS deleted_logs = ROW_COUNT;
    
    result_message := ''Limpieza completada: '' || deleted_locations || '' ubicaciones, '' || 
                     deleted_events || '' eventos, '' || deleted_logs || '' logs eliminados'';
    
    RETURN result_message;
END;'
LANGUAGE plpgsql;

-- ========================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ========================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS 
'BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;'
LANGUAGE plpgsql;

-- Aplicar trigger a tablas relevantes
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_drivers_updated_at
    BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_trackers_updated_at
    BEFORE UPDATE ON trackers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_geofences_updated_at
    BEFORE UPDATE ON geofences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_route_polylines_updated_at
    BEFORE UPDATE ON route_polylines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger para invalidar cache cuando se actualiza geocerca
CREATE OR REPLACE FUNCTION invalidate_geofence_cache()
RETURNS TRIGGER AS 
'BEGIN
    -- Marcar para re-sync a Redis y re-cache de JTS
    NEW.redis_synced_at = NULL;
    NEW.jts_cached_at = NULL;
    
    -- Calcular nuevo hash
    NEW.config_hash = calculate_geofence_config_hash(NEW.id);
    
    RETURN NEW;
END;'
LANGUAGE plpgsql;

CREATE TRIGGER invalidate_geofence_cache_trigger
    BEFORE UPDATE ON geofences
    FOR EACH ROW 
    WHEN (OLD.name IS DISTINCT FROM NEW.name OR
          OLD.coordinates_json IS DISTINCT FROM NEW.coordinates_json OR
          OLD.radius_meters IS DISTINCT FROM NEW.radius_meters OR
          OLD.max_speed_kmh IS DISTINCT FROM NEW.max_speed_kmh OR
          OLD.alert_on_entry IS DISTINCT FROM NEW.alert_on_entry OR
          OLD.alert_on_exit IS DISTINCT FROM NEW.alert_on_exit)
    EXECUTE FUNCTION invalidate_geofence_cache();

-- ========================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ========================================

-- Insertar usuario administrador de prueba
INSERT INTO user_profiles (ldap_uid, dni, user_type) VALUES
('admin001', '12345678', 'ADMINISTRADOR');

-- Insertar rutas de prueba
INSERT INTO routes (name, code, color) VALUES
('Ruta Norte - Sur', 'A1', '#0066CC'),
('Ruta Este - Oeste', 'B2', '#FF6600'),
('Ruta Circular', 'C3', '#00CC66');

-- ========================================
-- ÍNDICES ADICIONALES PARA PERFORMANCE (CORREGIDOS)
-- ========================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_geofence_events_vehicle_type_time 
ON geofence_events(vehicle_id, event_type, event_timestamp DESC);

CREATE INDEX idx_speed_violations_vehicle_severity_time 
ON speed_violations(vehicle_id, severity, start_timestamp DESC);

CREATE INDEX idx_system_alerts_status_priority_vehicle 
ON system_alerts(status, priority, vehicle_id);

-- Índices parciales corregidos (sin funciones no-immutable)
CREATE INDEX idx_active_geofences 
ON geofences(geofence_type_id, route_id) 
WHERE is_active = true;

CREATE INDEX idx_pending_sync_geofences 
ON geofences(updated_at) 
WHERE redis_synced_at IS NULL;

-- Índice para location_history reciente (sin usar CURRENT_DATE)
CREATE INDEX idx_recent_location_history 
ON location_history(vehicle_id, timestamp DESC);

-- Índices adicionales para mejor performance
CREATE INDEX idx_geofence_events_recent 
ON geofence_events(event_timestamp DESC, vehicle_id)
WHERE alert_generated = true;

CREATE INDEX idx_speed_violations_recent 
ON speed_violations(start_timestamp DESC, vehicle_id)
WHERE severity IN ('SEVERE', 'CRITICAL');

CREATE INDEX idx_active_drivers 
ON drivers(user_profile_id, current_vehicle_id)
WHERE status = 'ACTIVE';

CREATE INDEX idx_active_vehicles 
ON vehicles(route_id, status)
WHERE status = 'ACTIVE';

CREATE INDEX idx_active_trackers 
ON trackers(vehicle_id, status)
WHERE status = 'ACTIVE';

-- ========================================
-- COMENTARIOS FINALES Y CONFIGURACIÓN
-- ========================================

COMMENT ON DATABASE generic_track_db IS 'Sistema de Transporte Urbano - Base de datos principal para registro de eventos procesados por Redis+JTS';

-- ========================================
-- COMANDOS POST-INSTALACIÓN
-- ========================================

-- Ejecutar análisis inicial de estadísticas
ANALYZE;

-- Verificar configuración
SELECT 'Instalación completada correctamente' as status,
       COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Mostrar resumen de tablas creadas
SELECT table_name, 
       pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;

-- ========================================
-- FUNCIONES DE UTILIDAD ADICIONALES
-- ========================================

-- Función IMMUTABLE para obtener estadísticas del sistema
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS TABLE(
    stat_name VARCHAR,
    stat_value BIGINT,
    description VARCHAR
) AS 
'BEGIN
    RETURN QUERY
    SELECT ''Total Vehicles''::VARCHAR, 
           COUNT(*)::BIGINT, 
           ''Número total de vehículos en el sistema''::VARCHAR
    FROM vehicles
    UNION ALL
    SELECT ''Active Drivers''::VARCHAR, 
           COUNT(*)::BIGINT, 
           ''Conductores activos''::VARCHAR
    FROM drivers 
    WHERE status = ''ACTIVE''
    UNION ALL
    SELECT ''Total Geofences''::VARCHAR, 
           COUNT(*)::BIGINT, 
           ''Geocercas configuradas''::VARCHAR
    FROM geofences 
    WHERE is_active = true
    UNION ALL
    SELECT ''Events Last 24h''::VARCHAR, 
           COUNT(*)::BIGINT, 
           ''Eventos de geocercas en las últimas 24 horas''::VARCHAR
    FROM geofence_events 
    WHERE event_timestamp >= NOW() - INTERVAL ''24 hours''
    UNION ALL
    SELECT ''Pending Alerts''::VARCHAR, 
           COUNT(*)::BIGINT, 
           ''Alertas pendientes de atención''::VARCHAR
    FROM system_alerts 
    WHERE status = ''ACTIVE'';
END;'
LANGUAGE plpgsql STABLE;

-- Función IMMUTABLE para verificar integridad de datos
CREATE OR REPLACE FUNCTION check_data_integrity()
RETURNS TABLE(
    check_name VARCHAR,
    status VARCHAR,
    details VARCHAR
) AS 
'DECLARE
    orphaned_events INTEGER;
    missing_geofences INTEGER;
    inactive_trackers INTEGER;
BEGIN
    -- Verificar eventos huérfanos
    SELECT COUNT(*) INTO orphaned_events
    FROM geofence_events ge
    LEFT JOIN vehicles v ON ge.vehicle_id = v.id
    WHERE v.id IS NULL;
    
    -- Verificar geocercas sin tipo
    SELECT COUNT(*) INTO missing_geofences
    FROM geofences g
    LEFT JOIN geofence_types gt ON g.geofence_type_id = gt.id
    WHERE gt.id IS NULL;
    
    -- Verificar trackers inactivos
    SELECT COUNT(*) INTO inactive_trackers
    FROM trackers 
    WHERE status = ''ACTIVE'' AND last_seen < NOW() - INTERVAL ''1 hour'';
    
    RETURN QUERY
    SELECT ''Orphaned Events''::VARCHAR,
           CASE WHEN orphaned_events = 0 THEN ''OK'' ELSE ''WARNING'' END::VARCHAR,
           (orphaned_events || '' eventos sin vehículo asociado'')::VARCHAR
    UNION ALL
    SELECT ''Missing Geofence Types''::VARCHAR,
           CASE WHEN missing_geofences = 0 THEN ''OK'' ELSE ''ERROR'' END::VARCHAR,
           (missing_geofences || '' geocercas sin tipo definido'')::VARCHAR
    UNION ALL
    SELECT ''Inactive Trackers''::VARCHAR,
           CASE WHEN inactive_trackers = 0 THEN ''OK'' ELSE ''WARNING'' END::VARCHAR,
           (inactive_trackers || '' trackers sin reporte reciente'')::VARCHAR;
END;'
LANGUAGE plpgsql STABLE;

-- Función IMMUTABLE para limpiar location_history antiguo
CREATE OR REPLACE FUNCTION get_retention_date(days_back INTEGER)
RETURNS TIMESTAMP AS
'SELECT NOW() - (days_back || '' days'')::INTERVAL;'
LANGUAGE sql IMMUTABLE;

COMMIT;