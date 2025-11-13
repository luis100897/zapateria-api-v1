import { Router } from "express";
import cDetallesVenta from "../controllers/detallesVentaController.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.get(
  "/detalles-venta/:id",
  isAuthenticated,
  cDetallesVenta.obtenerDetallesVenta
);
router.get(
  "/detalles/:id_detalle",
  isAuthenticated,
  cDetallesVenta.obtenerDetallesVentaPorId
);

export default router;
