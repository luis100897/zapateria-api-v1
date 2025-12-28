import error from "../middlewares/error.js";
import db from "../models/index.js";
import moment from "moment";
import { salesValidator } from "../validators/salesValidator.js";
const { ArticuloVariante, Venta, DetallesVenta, sequelize } = db;

const cVentas = {
  registrarVenta: async (req, res) => {
    const { metodo_pago, items, total_venta_frontend } = req.body;
    const id_empleado = req.user.id_tipo_empleado;

    const t = await sequelize.transaction();
    try {
      const result = await salesValidator(
        metodo_pago,
        items,
        total_venta_frontend,
        t
      );

      if (!result.isValid) {
        await t.rollback();
        return res.status(result.code).json({
          code: result.code,
          isValid: result.isValid,
          title: result.title,
          message: result.message,
        });
      }
      // Insertar venta
      const ventaResult = await Venta.create(
        {
          metodo_pago,
          total: result.total_venta,
          id_empleado,
        },
        { transaction: t }
      );

      const id_venta = ventaResult.id_venta;

      for (const item of items) {
        await DetallesVenta.create(
          {
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            subtotal: item.subtotal,
            id_venta,
            id_variante: item.id_variante,
          },
          { transaction: t }
        );

        await ArticuloVariante.decrement(
          { stock: item.cantidad },
          {
            where: { id_variante: item.id_variante },
            transaction: t,
          }
        );
      }

      // Confirmar la transacción
      await t.commit();
      res.status(201).json({
        code: 201,
        title: "ok",
        message: "Venta generada con éxito",
      });
    } catch (err) {
      if (t) {
        await t.rollback();
      }
      return res.status(500).json({
        title: "Error 500: Internal Server",
        message: "Ocurrrió un error al registrar la venta",
      });
    }
  },
  obtenerListaVentas: async (req, res) => {
    try {
      const ventas = await Venta.findAll();
      const ventasFomateadas = ventas.map((venta) => {
        const data = venta.toJSON();
        const fecha = moment(data.fecha_venta).format("DD/MM/YYYY HH:mm:ss");
        return { ...data, fecha_venta: fecha };
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
