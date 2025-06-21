-- =====================================================
-- ENTRENAMIENTO POSTGRESQL - CONCEPTOS FUNDAMENTALES
-- =====================================================

-- 1. CREACIÓN DE TABLAS DUMMY CON RELACIÓN
-- =====================================================

-- Tabla de alumnos
CREATE TABLE alumnos (
    id_alumno SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE
);

SELECT * FROM alumnos

-- Tabla de cursos
CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    nombre_curso VARCHAR(100) NOT NULL,
    creditos INTEGER NOT NULL,
    id_alumno INTEGER REFERENCES alumnos(id_alumno)
);

-- Tabla de log para el trigger
CREATE TABLE log_alumnos (
    id_log SERIAL PRIMARY KEY,
    id_alumno INTEGER,
    accion VARCHAR(20),
    nombre_anterior VARCHAR(100),
    nombre_nuevo VARCHAR(100),
    email_anterior VARCHAR(150),
    email_nuevo VARCHAR(150),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_cambio VARCHAR(50) DEFAULT USER
);


-- Insertar datos de prueba
INSERT INTO alumnos (nombre, email) VALUES
('Juan Pérez', 'juan.perez@email.com'),
('María García', 'maria.garcia@email.com'),
('Carlos López', 'carlos.lopez@email.com');

INSERT INTO cursos (nombre_curso, creditos, id_alumno) VALUES
('Matemáticas', 4, 1),
('Historia', 3, 1),
('Física', 4, 2),
('Química', 3, 3);

--

-- =====================================================
-- 2. FUNCIÓN PARA RETORNAR JOIN ENTRE TABLAS
-- =====================================================

CREATE OR REPLACE FUNCTION obtener_alumnos_cursos()
RETURNS TABLE (
    alumno_id INTEGER,
    nombre_alumno VARCHAR(100),
    email_alumno VARCHAR(150),
    curso_id INTEGER,
    nombre_curso VARCHAR(100),
    creditos INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id_alumno,
        a.nombre,
        a.email,
        c.id_curso,
        c.nombre_curso,
        c.creditos
    FROM alumnos a
    INNER JOIN cursos c ON a.id_alumno = c.id_alumno
    ORDER BY a.nombre, c.nombre_curso;
END;
$$;

-- Ejemplo de uso:
SELECT * FROM obtener_alumnos_cursos();

-- =====================================================
-- 3. PROCEDIMIENTO PARA INSERCIÓN SIMPLE (SIN TRANSACCIÓN)
-- =====================================================

CREATE OR REPLACE PROCEDURE insertar_alumno(
    p_nombre VARCHAR(100),
    p_email VARCHAR(150)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO alumnos (nombre, email)
    VALUES (p_nombre, p_email);

    RAISE NOTICE 'Alumno % insertado correctamente', p_nombre;
END;
$$;

-- Ejemplo de uso:
CALL insertar_alumno('Ana Rodríguez', 'ana.rodriguez@email.com');


-- =====================================================
-- 4. PROCEDIMIENTO PARA INSERCIÓN EN DOS TABLAS (CON TRANSACCIÓN)
-- =====================================================

-- VERSIÓN 1: Sin COMMIT/ROLLBACK explícitos (recomendado)
CREATE OR REPLACE PROCEDURE insertar_alumno_con_curso(
    p_nombre VARCHAR(100),
    p_email VARCHAR(150),
    p_nombre_curso VARCHAR(100),
    p_creditos INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_alumno INTEGER;
BEGIN
    -- PostgreSQL maneja automáticamente la transacción
    -- Si hay error, se hace rollback automático

    -- Insertar alumno
    INSERT INTO alumnos (nombre, email)
    VALUES (p_nombre, p_email)
    RETURNING id_alumno INTO v_id_alumno;

    -- Insertar curso asociado
    INSERT INTO cursos (nombre_curso, creditos, id_alumno)
    VALUES (p_nombre_curso, p_creditos, v_id_alumno);

    RAISE NOTICE 'Alumno % y curso % insertados correctamente', p_nombre, p_nombre_curso;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al insertar alumno y curso: %', SQLERRM;
END;
$$;

-- Ejemplo de uso:
CALL insertar_alumno_con_curso('Pedro Martín', 'pedro.martin@email.com', 'Programación', 5);

SELECT * FROM obtener_alumnos_cursos();


-- VERSIÓN 2: Con manejo explícito de transacciones (solo si llamas desde fuera de transacción)
CREATE OR REPLACE PROCEDURE insertar_alumno_con_curso_v2(
    p_nombre VARCHAR(100),
    p_email VARCHAR(150),
    p_nombre_curso VARCHAR(100),
    p_creditos INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_alumno INTEGER;
BEGIN
    -- Esta versión funciona solo si NO estás dentro de una transacción activa
    -- Debes llamarla con: CALL insertar_alumno_con_curso_v2(...);
    -- NO dentro de BEGIN...END;

    -- Insertar alumno
    INSERT INTO alumnos (nombre, email)
    VALUES (p_nombre, p_email)
    RETURNING id_alumno INTO v_id_alumno;

    -- Insertar curso asociado
    INSERT INTO cursos (nombre_curso, creditos, id_alumno)
    VALUES (p_nombre_curso, p_creditos, v_id_alumno);

    COMMIT;
    RAISE NOTICE 'Alumno % y curso % insertados correctamente', p_nombre, p_nombre_curso;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE EXCEPTION 'Error al insertar alumno y curso: %', SQLERRM;
END;
$$;

CALL insertar_alumno_con_curso('Pedro Martín 2', 'pedro.martin2@email.com', 'Programación', 5);

SELECT * FROM obtener_alumnos_cursos();




-- =====================================================
-- 5. PROCEDIMIENTO PARA UPDATE CON TRANSACCIÓN
-- =====================================================

-- VERSIÓN 1: Sin COMMIT/ROLLBACK explícitos (recomendado)
CREATE OR REPLACE PROCEDURE actualizar_alumno(
    p_id_alumno INTEGER,
    p_nuevo_nombre VARCHAR(100),
    p_nuevo_email VARCHAR(150)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE alumnos
    SET nombre = p_nuevo_nombre,
        email = p_nuevo_email
    WHERE id_alumno = p_id_alumno;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el alumno con ID %', p_id_alumno;
    END IF;

    RAISE NOTICE 'Alumno con ID % actualizado correctamente', p_id_alumno;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar alumno: %', SQLERRM;
END;
$$;

-- VERSIÓN 2: Con manejo explícito (solo si no estás en transacción activa)
CREATE OR REPLACE PROCEDURE actualizar_alumno_v3(
    p_id_alumno INTEGER,
    p_nuevo_nombre VARCHAR(100),
    p_nuevo_email VARCHAR(150)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_nombre_actual VARCHAR(100);  -- Variable para guardar el nombre actual
BEGIN

 -- Validar si existe el alumno con ese ID
    SELECT nombre INTO v_nombre_actual
    FROM alumnos
    WHERE id_alumno = p_id_alumno;

    IF v_nombre_actual IS NULL THEN
        RAISE EXCEPTION
            SQLSTATE 'A0001'
            USING MESSAGE = 'No se encontró el alumno con ID...',
                  DETAIL = 'No se encontró el alumno con aquel identificador',
                  HINT = 'Cambie el id';
    END IF;

    UPDATE alumnos
    SET nombre = p_nuevo_nombre,
        email = p_nuevo_email
    WHERE id_alumno = p_id_alumno;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            SQLSTATE 'U0001'
            USING MESSAGE = 'No se encontró el alumno con ID %',
                  DETAIL = 'No se encontró el alumno con aquel identificador',
                  HINT = 'Cambie el id';
        --RAISE EXCEPTION 'No se encontró el alumno con ID %', p_id_alumno;
    END IF;

    COMMIT;
    RAISE NOTICE 'Alumno con ID % actualizado correctamente', p_id_alumno;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;  -- ✅ Re-lanza la excepción original con el mismo SQLSTATE
END;
$$;

-- Ejemplo de uso:
CALL actualizar_alumno(100, 'Juan Carlos Pérez', 'juancarlos.perez@email.com');

CALL actualizar_alumno_v3(100, 'Juan Carlos Pérez', 'juancarlos.perez@email.com');

SELECT * FROM obtener_alumnos_cursos();


--



-- =====================================================
-- 6. TRIGGER PARA GENERAR LOG EN UPDATES
-- =====================================================

-- Función del trigger
CREATE OR REPLACE FUNCTION fn_log_alumnos_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO log_alumnos (
        id_alumno,
        accion,
        nombre_anterior,
        nombre_nuevo,
        email_anterior,
        email_nuevo
    )
    VALUES (
        NEW.id_alumno,
        'UPDATE',
        OLD.nombre,
        NEW.nombre,
        OLD.email,
        NEW.email
    );

    RETURN NEW;
END;
$$;

-- Crear el trigger
CREATE TRIGGER tr_log_alumnos_update
    AFTER UPDATE ON alumnos
    FOR EACH ROW
    EXECUTE FUNCTION fn_log_alumnos_update();

-- =====================================================
-- 7. PROCEDIMIENTO PARA DELETE
-- =====================================================

CREATE OR REPLACE PROCEDURE eliminar_alumno(
    p_id_alumno INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Verificar si existen cursos asociados
    SELECT COUNT(*) INTO v_count
    FROM cursos
    WHERE id_alumno = p_id_alumno;

    IF v_count > 0 THEN
        RAISE EXCEPTION 'No se puede eliminar el alumno. Tiene % curso(s) asociado(s)', v_count;
    END IF;

    DELETE FROM alumnos
    WHERE id_alumno = p_id_alumno;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el alumno con ID %', p_id_alumno;
    END IF;

    RAISE NOTICE 'Alumno con ID % eliminado correctamente', p_id_alumno;
END;
$$;

-- Ejemplo de uso:
-- CALL eliminar_alumno(4);

-- =====================================================
-- 8. FUNCIÓN Y PROCEDIMIENTO CON CÓDIGOS DE ERROR PERSONALIZADOS
-- =====================================================

-- Función que genera error personalizado
CREATE OR REPLACE FUNCTION validar_email_alumno(p_email VARCHAR(150))
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validar formato de email básico
    IF p_email NOT LIKE '%@%.%' THEN
        RAISE EXCEPTION
            SQLSTATE 'P0001'
            USING MESSAGE = 'Formato de email inválido',
                  DETAIL = 'El email debe contener @ y un dominio válido',
                  HINT = 'Ejemplo: usuario@dominio.com';
    END IF;

    -- Validar email duplicado
    IF EXISTS (SELECT 1 FROM alumnos WHERE email = p_email) THEN
        RAISE EXCEPTION
            SQLSTATE 'P0002'
            USING MESSAGE = 'Email ya existe en el sistema',
                  DETAIL = 'El email ' || p_email || ' ya está registrado',
                  HINT = 'Use un email diferente';
    END IF;

    RETURN TRUE;
END;
$$;

-- Procedimiento que usa la función de validación
CREATE OR REPLACE PROCEDURE insertar_alumno_validado(
    p_nombre VARCHAR(100),
    p_email VARCHAR(150)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_valido BOOLEAN;
BEGIN
    -- Validar datos de entrada
    IF p_nombre IS NULL OR LENGTH(TRIM(p_nombre)) = 0 THEN
        RAISE EXCEPTION
            SQLSTATE 'P0003'
            USING MESSAGE = 'Nombre requerido',
                  DETAIL = 'El nombre del alumno no puede estar vacío',
                  HINT = 'Proporcione un nombre válido';
    END IF;

    -- Validar email usando la función
    SELECT validar_email_alumno(p_email) INTO v_valido;

    -- Si llegamos aquí, todos los datos son válidos
    INSERT INTO alumnos (nombre, email)
    VALUES (p_nombre, p_email);

    RAISE NOTICE 'Alumno % insertado y validado correctamente', p_nombre;

EXCEPTION
    WHEN SQLSTATE 'P0001' THEN
        RAISE EXCEPTION 'Error de validación de email: %', SQLERRM;
    WHEN SQLSTATE 'P0002' THEN
        RAISE EXCEPTION 'Error de duplicidad: %', SQLERRM;
    WHEN SQLSTATE 'P0003' THEN
        -- RAISE EXCEPTION 'Error de datos requeridos: %', SQLERRM;
        RAISE EXCEPTION
            SQLSTATE 'P0003'
            USING MESSAGE = 'Nombre requerido',
                  DETAIL = 'El nombre del alumno no puede estar vacío',
                  HINT = 'Proporcione un nombre válido';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inesperado: %', SQLERRM;
END;
$$;


CALL insertar_alumno_validado('', 'email_invalido');  -- Error P0003 y P0001
