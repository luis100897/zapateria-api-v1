import { Router } from "express";
import cArticulosVariante from "../controllers/articulosVarianteController.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.get(
  "/variantes",
  isAuthenticated,
  cArticulosVariante.obtenerListaVariantes
);
router.post("/variantes", isAuthenticated, cArticulosVariante.crearVariante);
router.get(
  "/variantes/:id",
  isAuthenticated,
  cArticulosVariante.obtenerVariantePorId
);
router.put(
  "/variantes/:id",
  isAuthenticated,
  cArticulosVariante.editarVariante
);
router.put(
  "/variantes/:id/stock",
  isAuthenticated,
  cArticulosVariante.actualizarStock
);
router.get(
  "/variantes/:id/detalles",
  isAuthenticated,
  cArticulosVariante.obtenerDetallesVariantePorId
);

export default router;
