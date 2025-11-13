import { Router } from "express";
import cVentas from "../controllers/ventasController.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.post("/ventas", isAuthenticated, cVentas.registrarVenta);
router.get("/ventas", isAuthenticated, cVentas.obtenerListaVentas);
// Obtener una venta por su ID Proximamente...
//router.get("/ventas/:id", isAuthenticated, cVentas.obtenerVentaPorId);

export default router;
