import error from "../middlewares/error.js";
import mArticulosVariante from "../models/mArticulosVariante.js";
import pool from "../config/db.js";
import moment from "moment";
import mDevoluciones from "../models/mDevoluciones.js";
import trimObjectValues from "../helpers/trimObjectValues.js";
import validateFormData from "../helpers/validateFormData.js";
import { devolucionValidator } from "../validators/devolucionValidator.js";

const cDevoluciones = {
  registrarDevolucion: async (req, res) => {
    let connection;
    try {
      const devolucion = trimObjectValues(req.body);

      if (!validateFormData(devolucion)) {
        return res.status(400).json({
          title: "Error 400: Bad Request",
          message: "datos incompletos",
        });
      }

      const id_empleado = req.user.id_tipo_empleado;
      const id_venta = parseInt(devolucion.id_venta);
      const id_detalle = parseInt(devolucion.id_detalle);
      devolucion.cantidad = parseInt(devolucion.cantidad);

      const result = await devolucionValidator(devolucion);
      const venta = result.venta;

      if (!result.isValid) {
        return res.status(400).json({
          title: "Error 400: Bad Request",
          message: result.message,
        });
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Insertar la devolucion
      const precio_unitario = venta.precio_unitario;
      const monto_reembolso = precio_unitario * devolucion.cantidad;
      await mDevoluciones.registrarDevolucion(
        {
          motivo: devolucion.motivo,
          cantidad: devolucion.cantidad, // Usar la cantidad actual a devolver
          metodo_reembolso: devolucion.metodo_reembolso,
          monto_reembolso,
          id_empleado,
          id_venta,
          id_detalle,
        },
        connection
      );

      await mArticulosVariante.actualizarStockMas(
        venta.id_variante,
        devolucion.cantidad, // Usar la cantidad actual a devolver para el stock
        connection
      );

      // Confirmar la transacción
      await connection.commit();
      res.status(201).json({
        code: 201,
        title: "ok",
        message: "Devolución generada con éxito",
      });
    } catch (err) {
      if (connection) await connection.rollback();
      return error.e500(req, res, err);
    } finally {
      if (connection) connection.release();
    }
  },
  obtenerListaDevoluciones: async (req, res) => {
    try {
      const devoluciones = await mDevoluciones.obtenerListaDevoluciones();
      const devolucionesFomateadas = devoluciones.map((devolucion) => {
        const fecha = moment(devolucion.fecha_devolucion).format(
          "DD/MM/YYYY HH:mm:ss"
        );
        return { ...devolucion, fecha_devolucion: fecha };
      });
      res.status(201).json({
        code: 201,
        title: "ok",
        message: "lista de devoluciones",
        devoluciones: devolucionesFomateadas,
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
};

export default cDevoluciones;
