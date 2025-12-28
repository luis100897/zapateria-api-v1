CREATE DATABASE IF NOT exists zapateria_eleganzza_shoes;
USE zapateria_eleganzza_shoes;
SHOW TABLES;

/*Tabla tipo de empleados*/
CREATE TABLE tipo_empleado (
    id_tipo_empleado INT AUTO_INCREMENT PRIMARY KEY,
    tipo_empleado VARCHAR(50) NOT NULL
);
/*Tabla empleados*/
CREATE TABLE empleados (
    id_empleado INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    direccion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL,
    id_tipo_empleado INT NOT NULL,
    FOREIGN KEY (id_tipo_empleado) REFERENCES tipo_empleado(id_tipo_empleado)
);
ALTER TABLE empleados 
ADD CONSTRAINT chk_telefono CHECK (telefono REGEXP '^[0-9]+$');
/*Tabla ventas*/
CREATE TABLE ventas (
    id_venta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pago ENUM('Efectivo', 'Tarjeta') NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    id_empleado INT UNSIGNED NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

/*Tabla articulos*/
CREATE TABLE articulos (
    id_articulo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

/*Tabla articulo-variante*/
CREATE TABLE articulo_variante (
    id_variante INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    talla VARCHAR(10) NOT NULL,
    color VARCHAR(30) NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    id_articulo INT UNSIGNED NOT NULL,
    FOREIGN KEY (id_articulo) REFERENCES articulos(id_articulo)
);

/*Tabla detalles-venta*/
CREATE TABLE detalles_venta (
    id_detalle INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cantidad INT UNSIGNED NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    id_venta INT UNSIGNED NOT NULL,
    id_variante INT UNSIGNED NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    FOREIGN KEY (id_variante) REFERENCES articulo_variante(id_variante)
);

/*Tabla devoluciones*/
CREATE TABLE devoluciones (
    id_devolucion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha_devolucion DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT NOT NULL,
    cantidad INT UNSIGNED NOT NULL,
    metodo_reembolso ENUM('Efectivo', 'Tarjeta') NOT NULL,
    monto_reembolso DECIMAL(10,2) NOT NULL,
    id_empleado INT UNSIGNED NOT NULL,
    id_venta INT UNSIGNED NOT NULL,
    id_detalle INT UNSIGNED NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado),
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    FOREIGN KEY (id_detalle) REFERENCES detalles_venta(id_detalle)
);

ALTER TABLE tipo_empleado MODIFY tipo_empleado VARCHAR(50) NOT NULL UNIQUE;