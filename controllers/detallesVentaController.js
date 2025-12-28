import db from "../models/index.js";
import error from "../middlewares/error.js";
const { DetallesVenta } = db;

const cDetallesVenta = {
  obtenerDetallesVenta: async (req, res) => {
    try {
      let id = parseInt(req.params.id);
      let detallesVenta = await DetallesVenta.findAll({
        where: {
          id_venta: id,
        },
      });
      if (!detallesVenta || detallesVenta.length === 0) {
        error.e404(req, res);
      } else {
        res.json({ code: 200, title: "ok", detallesVenta });
      }
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
  obtenerDetallesVentaPorId: async (req, res) => {
    const { id_detalle } = req.params;
    try {
      const detalleVenta = await DetallesVenta.findByPk(id_detalle, {
        attributes: [
          "id_venta",
          "id_variante",
          "cantidad",
          "precio_unitario",
          "subtotal",
        ],
      });
      if (!detalleVenta) {
        return res.status(404).json({
          code: 404,
          title: "Not Found",
          message: "Detalle de venta no encontrado o no asociado a la venta.",
        });
      }
      return res.status(200).json({
        code: 200,
        title: "OK",
        data: detalleVenta,
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
};
export default cDetallesVenta;
