import { Router } from "express";
import cDevoluciones from "../controllers/devolucionesController.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.post(
  "/devoluciones",
  isAuthenticated,
  cDevoluciones.registrarDevolucion
);
router.get(
  "/devoluciones",
  isAuthenticated,
  cDevoluciones.obtenerListaDevoluciones
);
//proximamente...
//router.get("/devoluciones/:id", cDevoluciones.obtenerDevolucionPorId);

export default router;
