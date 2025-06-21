-- PASO 1: CREAR TABLA DE PRUEBA PARTICIONADA
DROP TABLE IF EXISTS test_gps_data CASCADE;

CREATE TABLE test_gps_data (
    id BIGSERIAL,
    vehicle_id INTEGER NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    speed DECIMAL(5,2) DEFAULT 0,
    timestamp TIMESTAMP NOT NULL,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);



-- PASO 2: CREAR PARTICIONES PARA DIFERENTES AÑOS
CREATE TABLE test_gps_data_2022 PARTITION OF test_gps_data
    FOR VALUES FROM ('2022-01-01 00:00:00') TO ('2023-01-01 00:00:00');

CREATE TABLE test_gps_data_2023 PARTITION OF test_gps_data
    FOR VALUES FROM ('2023-01-01 00:00:00') TO ('2024-01-01 00:00:00');

CREATE TABLE test_gps_data_2024 PARTITION OF test_gps_data
    FOR VALUES FROM ('2024-01-01 00:00:00') TO ('2025-01-01 00:00:00');

CREATE TABLE test_gps_data_2025 PARTITION OF test_gps_data
    FOR VALUES FROM ('2025-01-01 00:00:00') TO ('2026-01-01 00:00:00');

-- Partición por defecto para datos fuera de rango
CREATE TABLE test_gps_data_default PARTITION OF test_gps_data DEFAULT;

-- PASO 3: CREAR ÍNDICES
CREATE INDEX idx_test_gps_vehicle_time ON test_gps_data(vehicle_id, timestamp);
CREATE INDEX idx_test_gps_coords ON test_gps_data(latitude, longitude);

-- ========================================
-- PASO 4: FUNCIÓN PARA GENERAR DATOS DE PRUEBA
-- ========================================

-- FUNCIÓN CORREGIDA PARA GENERAR DATOS DE PRUEBA
CREATE OR REPLACE FUNCTION generate_test_gps_data(
    year_value INTEGER,
    records_count INTEGER DEFAULT 1000
)
RETURNS INTEGER AS $$
DECLARE
    i INTEGER;
    random_vehicle INTEGER;
    random_lat DECIMAL(10,8);
    random_lng DECIMAL(11,8);
    random_speed DECIMAL(5,2);
    random_timestamp TIMESTAMP;
    start_date DATE;
    end_date DATE;
    days_in_year INTEGER;
    inserted_count INTEGER := 0;
BEGIN
    start_date := make_date(year_value, 1, 1);
    end_date := make_date(year_value, 12, 31);
    days_in_year := (end_date - start_date)::INTEGER;

    RAISE NOTICE 'Generando % registros para el año %...', records_count, year_value;

    FOR i IN 1..records_count LOOP
        -- Generar datos aleatorios realistas
        random_vehicle := (random() * 99 + 1)::INTEGER; -- vehicles 1-100
        random_lat := -12.0 + (random() * 0.2); -- Lima, Perú aproximadamente
        random_lng := -77.1 + (random() * 0.2);
        random_speed := (random() * 80)::DECIMAL(5,2); -- 0-80 km/h

        -- Generar timestamp aleatorio dentro del año (CORREGIDO)
        random_timestamp := start_date::TIMESTAMP +
                           (random() * days_in_year || ' days')::INTERVAL +
                           (random() * INTERVAL '23:59:59');

        INSERT INTO test_gps_data (vehicle_id, latitude, longitude, speed, timestamp)
        VALUES (random_vehicle, random_lat, random_lng, random_speed, random_timestamp);

        inserted_count := inserted_count + 1;

        -- Mostrar progreso cada 200 registros
        IF i % 200 = 0 THEN
            RAISE NOTICE 'Insertados % de % registros para %', i, records_count, year_value;
        END IF;
    END LOOP;

    RAISE NOTICE 'Completado: % registros insertados para el año %', inserted_count, year_value;
    RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- PASO 5: POBLAR CON DATOS DE PRUEBA
-- ========================================

-- Generar 1000 registros para cada año
SELECT generate_test_gps_data(2022, 1000);
SELECT generate_test_gps_data(2023, 1000);
SELECT generate_test_gps_data(2024, 1000);
SELECT generate_test_gps_data(2025, 1000);



-- Generar algunos registros adicionales para mostrar la partición por defecto
INSERT INTO test_gps_data (vehicle_id, latitude, longitude, speed, timestamp)
VALUES
    (1, -12.0464, -77.0428, 25.5, '2021-06-15 14:30:00'),
    (2, -12.0464, -77.0428, 30.0, '2026-03-20 09:15:00');



-- 1. Ver distribución de datos por partición
SELECT
    'RESUMEN POR PARTICIÓN' as info,
    '===================' as separator;

SELECT
    schemaname,
    tablename as partition_name,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_on_disk,
    (SELECT COUNT(*) FROM pg_tables p2 WHERE p2.tablename = t.tablename) as exists_check
FROM pg_tables t
WHERE tablename LIKE 'test_gps_data_%'
ORDER BY tablename;

-- 2. Contar registros por partición usando información del sistema
WITH partition_counts AS (
    SELECT
        'test_gps_data_2022' as partition_name,
        (SELECT COUNT(*) FROM test_gps_data_2022) as record_count,
        '2022' as year_data
    UNION ALL
    SELECT
        'test_gps_data_2023',
        (SELECT COUNT(*) FROM test_gps_data_2023),
        '2023'
    UNION ALL
    SELECT
        'test_gps_data_2024',
        (SELECT COUNT(*) FROM test_gps_data_2024),
        '2024'
    UNION ALL
    SELECT
        'test_gps_data_2025',
        (SELECT COUNT(*) FROM test_gps_data_2025),
        '2025'
    UNION ALL
    SELECT
        'test_gps_data_default',
        (SELECT COUNT(*) FROM test_gps_data_default),
        'default'
)
SELECT
    partition_name,
    record_count,
    year_data,
    CASE
        WHEN record_count > 0 THEN '✅ Tiene datos'
        ELSE '❌ Sin datos'
    END as status
FROM partition_counts
ORDER BY year_data;

-- SELECT DATA
SELECT vehicle_id, COUNT(*), AVG(speed)
FROM test_gps_data
WHERE timestamp >= '2024-01-01' AND timestamp < '2025-01-01'
GROUP BY vehicle_id;

EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*)
FROM test_gps_data
WHERE timestamp >= '2023-01-01' AND timestamp < '2024-01-01';

EXPLAIN (ANALYZE, BUFFERS)
SELECT vehicle_id, latitude, longitude
FROM test_gps_data
WHERE vehicle_id = 70 and timestamp >= '2023-01-01' AND timestamp < '2024-01-01';