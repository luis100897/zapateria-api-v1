import mVentas from "../models/mVentas.js";
import error from "../middlewares/error.js";
import mArticulosVariante from "../models/mArticulosVariante.js";
import mDetallesVenta from "../models/mDetallesVenta.js";
import pool from "../config/db.js";
import moment from "moment";
import { salesValidator } from "../validators/salesValidator.js";

const cVentas = {
  registrarVenta: async (req, res) => {
    const { metodo_pago, items, total_venta_frontend } = req.body;
    const id_empleado = req.user.id_tipo_empleado;
    let connection;
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Iniciar la transacción
    await connection.beginTransaction();
    try {
      const result = await salesValidator(
        metodo_pago,
        items,
        total_venta_frontend
      );

      if (!result.isValid) {
        console.log(result);
        return res.status(result.code).json({
          code: result.code,
          isValid: result.isValid,
          title: result.title,
          message: result.message,
        });
      }

      // Insertar venta
      const ventaResult = await mVentas.guardarVenta(
        {
          metodo_pago,
          total: result.total_venta,
          id_empleado,
        },
        connection
      );

      const id_venta = ventaResult.insertId;

      // Insertar detalles de venta y actualizar stock
      for (const item of items) {
        await mDetallesVenta.guardarDetalleVenta(
          {
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            subtotal: item.subtotal,
            id_venta,
            id_variante: item.id_variante,
          },
          connection
        );

        await mArticulosVariante.actualizarStock(
          item.id_variante,
          item.cantidad,
          connection
        ); // Pasar la conexión
      }

      // Confirmar la transacción
      await connection.commit();
      res.status(201).json({
        code: 201,
        title: "ok",
        message: "Venta generada con éxito",
      });
    } catch (err) {
      if (connection) {
        await connection.rollback();
      }
      console.log(err);
      return res.status(500).json({
        title: "Error 500: Internal Server",
        message: "Ocurrrió un error al registrar la venta",
      });
    } finally {
      // Liberar la conexión de vuelta al pool
      if (connection) {
        connection.release();
      }
    }
  },
  obtenerListaVentas: async (req, res) => {
    try {
      const ventas = await mVentas.obtenerListaVentas();
      const ventasFomateadas = ventas.map((venta) => {
        const fecha = moment(venta.fecha_venta).format("DD/MM/YYYY HH:mm:ss");
        return { ...venta, fecha_venta: fecha };
      });
      res.json({
        code: 201,
        message: "ok",
        ventas: ventasFomateadas,
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
  obtenerVentaPorId: async (req, res) => {
    try {
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
};

export default cVentas;
