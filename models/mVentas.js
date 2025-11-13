import db from "../config/db.js";

const mVentas = {
  guardarVenta: async (venta, connection) => {
    try {
      const [results] = await connection.execute(
        "INSERT INTO ventas (metodo_pago, total, id_empleado) VALUES (?, ?, ?)",
        [venta.metodo_pago, venta.total, venta.id_empleado]
      );
      //console.log(results);
      return results;
    } catch (err) {
      throw {
        status: 500,
        message: `Error al obtener lista de las ventas`,
      };
    }
  },
  obtenerListaVentas: async () => {
    try {
      const [results] = await db.query(
        "SELECT id_venta, fecha_venta, metodo_pago, total, id_empleado FROM ventas"
      );
      return results;
    } catch (error) {
      throw {
        status: 500,
        message: `Error al obtener lista de las ventas`,
      };
    }
  },
  obtenerVentaPorId: async (id_detalle, id_venta) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM detalles_venta WHERE id_detalle = ? AND id_venta = ?",
        [id_detalle, id_venta]
      );
      console.log(results.length);
      console.log(typeof results.length);
      if (results.length === 0) {
        return null;
      }
      return results[0];
    } catch (error) {
      throw {
        status: 500,
        message: `Error al obtener el id de la venta`,
      };
    }
  },
  editarVenta: async (id, venta) => {
    try {
    } catch (error) {
      throw {
        status: 500,
        message: `Error al crear el articulo`,
      };
    }
  },
};

export default mVentas;
