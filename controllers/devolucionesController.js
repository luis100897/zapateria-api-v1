import error from "../middlewares/error.js";
import db from "../models/index.js";
import moment from "moment";
import trimObjectValues from "../helpers/trimObjectValues.js";
import validateFormData from "../helpers/validateFormData.js";
import { devolucionValidator } from "../validators/devolucionValidator.js";

const { ArticuloVariante, Devolucion, sequelize } = db;

const cDevoluciones = {
  registrarDevolucion: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const devolucion = trimObjectValues(req.body);

      if (!validateFormData(devolucion)) {
        await t.rollback();
        return res.status(400).json({
          title: "Error 400: Bad Request",
          message: "datos incompletos",
        });
      }

      const id_empleado = req.user.id_tipo_empleado;
      const id_venta = parseInt(devolucion.id_venta);
      const id_detalle = parseInt(devolucion.id_detalle);
      devolucion.cantidad = parseInt(devolucion.cantidad);

      const result = await devolucionValidator(devolucion, t);
      const venta = result.venta;

      if (!result.isValid) {
        await t.rollback();
        return res.status(400).json({
          title: "Error 400: Bad Request",
          message: result.message,
        });
      }

      // Insertar la devolucion
      const precio_unitario = venta.precio_unitario;
      const monto_reembolso = precio_unitario * devolucion.cantidad;
      await Devolucion.create(
        {
          motivo: devolucion.motivo,
          cantidad: devolucion.cantidad, // Usar la cantidad actual a devolver
          metodo_reembolso: devolucion.metodo_reembolso,
          monto_reembolso,
          id_empleado,
          id_venta,
          id_detalle,
        },
        { transaction: t }
      );

      await ArticuloVariante.increment(
        { stock: devolucion.cantidad },
        { where: { id_variante: venta.id_variante }, transaction: t }
      );

      // Confirmar la transacción
      await t.commit();
      res.status(201).json({
        code: 201,
        title: "ok",
        message: "Devolución generada con éxito",
      });
    } catch (err) {
      if (t) {
        await t.rollback();
      }
      return error.e500(req, res, err);
    }
  },
  obtenerListaDevoluciones: async (req, res) => {
    try {
      const devoluciones = await Devolucion.findAll();
      const devolucionesFomateadas = devoluciones.map((devolucion) => {
        const data = devolucion.toJSON();
        const fecha = moment(data.fecha_devolucion).format(
          "DD/MM/YYYY HH:mm:ss"
        );
        return { ...data, fecha_devolucion: fecha };
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
