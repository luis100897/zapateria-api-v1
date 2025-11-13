import db from "../config/db.js";

const mDetallesVenta = {
  guardarDetalleVenta: async (detalle, connection) => {
    try {
      const [results] = await connection.execute(
        "INSERT INTO detalles_venta (cantidad, precio_unitario, subtotal, id_venta, id_variante) VALUES (?, ?, ?, ?, ?)",
        [
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal,
          detalle.id_venta,
          detalle.id_variante,
        ]
      );
      return results;
    } catch (err) {
      throw err;
    }
  },
  obtenerDetallesVentaPorId: async (id_detalle) => {
    try {
      const [results] = await db.query(
        "SELECT id_venta, precio_unitario  FROM detalles_venta WHERE id_detalle = ?",
        [id_detalle]
      );
      if (results.length > 0) {
        return results[0];
      } else {
        return null; // Indica que no se encontró el detalle de la venta
      }
    } catch (error) {
      throw {
        status: 500,
        message: `Error al obtener el detalle de la venta de la bd `,
      };
    }
  },
  obtenerDetallesVentaPorIdVenta: async (id_venta) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM detalles_venta WHERE id_venta = ?",
        [id_venta]
      );
      if (results.length > 0) {
        console.log("resultados", results);
        return results;
      } else {
        return null; // Indica que no se encontró el detalle de la venta
      }
    } catch (error) {
      throw {
        status: 500,
        message: `Error al obtener el detalle de la venta de la bd `,
      };
    }
  },
};

export default mDetallesVenta;
