import { Router } from "express";
import cEmpleados from "../controllers/empleadosController.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.post(
  "/empleados",
  isAuthenticated,
  authorizeRole(["gerente"]),
  cEmpleados.crearEmpleado
);

router.get(
  "/empleados",
  isAuthenticated,
  authorizeRole(["gerente"]),
  cEmpleados.obtenerListaEmpleados
);

router.get(
  "/empleados/:id",
  isAuthenticated,
  authorizeRole(["gerente"]),
  cEmpleados.obtenerEmpleadoPorId
);

router.put(
  "/empleados/:id",
  isAuthenticated,
  authorizeRole(["gerente"]),
  cEmpleados.editarEmpleado
);

export default router;
