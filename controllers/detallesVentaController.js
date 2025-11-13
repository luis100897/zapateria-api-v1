import mDetallesVenta from "../models/mDetallesVenta.js";
import error from "../middlewares/error.js";
import mVentas from "../models/mVentas.js";

const cDetallesVenta = {
  obtenerDetallesVenta: async (req, res) => {
    try {
      let id = parseInt(req.params.id);
      let detallesVenta = await mDetallesVenta.obtenerDetallesVentaPorIdVenta(
        id
      );
      if (!detallesVenta) {
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
      const detalleVenta = await mDetallesVenta.obtenerDetallesVentaPorId(
        id_detalle
      );
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
