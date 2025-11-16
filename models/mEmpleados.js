import db from "../config/db.js";
import bcrypt from "bcrypt";
const mEmpleados = {
  crearEmpleado: async (empleado) => {
    try {
      const hash = await bcrypt.hash(empleado.password, 10);
      const [results] = await db.query(
        "INSERT INTO empleados (nombre, apellido_paterno, apellido_materno, telefono, direccion, password, id_tipo_empleado, username, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          empleado.nombre,
          empleado.apellido_paterno,
          empleado.apellido_materno,
          empleado.telefono,
          empleado.direccion,
          hash,
          empleado.id_tipo_empleado,
          empleado.username,
          empleado.status,
        ]
      );
      return results;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: `Error al crear el empleado ${empleado.username}`,
      };
    }
  },

  obtenerListaEmpleados: async () => {
    try {
      const [results] = await db.query(
        "SELECT id_empleado, nombre, apellido_paterno, apellido_materno, telefono, direccion, fecha_registro, id_tipo_empleado, username, status FROM empleados"
      );
      return results;
    } catch (error) {
      throw { status: 500, message: "Error al cargar los empleados" };
    }
  },

  obtenerEmpleadoPorUsername: async (username) => {
    const roleMapping = {
      1: "vendedor",
      2: "gerente",
      3: "cajero",
    };
    try {
      const [results] = await db.query(
        "SELECT * FROM empleados WHERE username = ?",
        [username]
      );
      if (results.length === 0) {
        return null;
      }

      const empleado = results[0];

      // Añade una propiedad 'rol' al objeto empleado
      empleado.rol = roleMapping[empleado.id_tipo_empleado];
      if (!empleado.rol) {
        console.error(
          `ID de rol inválido: ${empleado.id_tipo_empleado} para el usuario ${username}`
        );
        empleado.rol = "desconocido";
      }

      return empleado;
    } catch (err) {
      throw {
        status: 500,
        message: `Error al buscar empleado por username: ${username} ${err}`,
      };
    }
  },

  obtenerEmpleadoPorId: async (id) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM empleados WHERE id_empleado = ?",
        id
      );
      return results[0];
    } catch (error) {
      throw {
        status: 500,
        message: `Error al obtener el empleado con el id ${id}`,
      };
    }
  },

  editarEmpleado: async (id, empleado) => {
    try {
      const {
        nombre,
        apellido_paterno,
        apellido_materno,
        telefono,
        direccion,
        id_tipo_empleado,
        username,
        status,
      } = empleado;
      await db.query(
        "UPDATE empleados SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, telefono = ?, direccion = ?, id_tipo_empleado = ?, username = ?, status = ? WHERE id_empleado = ?",
        [
          nombre,
          apellido_paterno,
          apellido_materno,
          telefono,
          direccion,
          id_tipo_empleado,
          username,
          status,
          id,
        ]
      );
      return { id, ...empleado };
    } catch (error) {
      console.log(error);
      throw {
        status: 500,
        message: `Error al actualizar el empleado con el id ${id}`,
      };
    }
  },
  buscarEmpleadoUnico: async (
    nombre,
    apellido_paterno,
    apellido_materno,
    telefono,
    direccion
  ) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM empleados WHERE nombre = ? AND apellido_paterno = ? AND apellido_materno = ? AND telefono = ? AND direccion = ?",
        [nombre, apellido_paterno, apellido_materno, telefono, direccion]
      );
      return results; // Devuelve un array de variantes coincidentes (debería ser 0 o 1)
    } catch (err) {
      console.log(err);
      throw { status: 500, message: "Error al devolver la consulta" };
    }
  },
};

export default mEmpleados;
