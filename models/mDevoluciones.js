import db from "../config/db.js";

const mDevoluciones = {
  registrarDevolucion: async (devolucion) => {
    try {
      const [results] = await db.query(
        "INSERT INTO devoluciones (motivo, cantidad, metodo_reembolso, monto_reembolso, id_empleado, id_venta, id_detalle ) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          devolucion.motivo,
          devolucion.cantidad,
          devolucion.metodo_reembolso,
          devolucion.monto_reembolso,
          devolucion.id_empleado,
          devolucion.id_venta,
          devolucion.id_detalle,
        ]
      );
      return results;
    } catch (error) {
      console.log(error);
      throw {
        status: 500,
        message: `Error al registrar la devolucion`,
      };
    }
  },
  obtenerListaDevoluciones: async () => {
    try {
      const [results] = await db.query("SELECT  * FROM devoluciones");
      return results;
      console.log("datos enviado al controlador: ", results);
    } catch (error) {
      throw {
        status: 500,
        message: `Error al obtener lista de las ventas`,
      };
    }
  },
};

export default mDevoluciones;
