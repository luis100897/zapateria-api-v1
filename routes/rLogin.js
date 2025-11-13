import { Router } from "express";
import cLogin from "../controllers/loginController.js";
import cCajero from "../controllers/cajeroController.js";
import cGerente from "../controllers/gerenteController.js";
import cVendedor from "../controllers/vendedorController.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

const routes = Router();

routes.post("/login", cLogin.login);

routes.get("/logout", cLogin.logout);

routes.get(
  "/gerente",
  isAuthenticated,
  authorizeRole(["gerente"]),
  cGerente.dashboard
);

routes.get(
  "/cajero",
  isAuthenticated,
  authorizeRole(["cajero"]),
  cCajero.dashboard
);

routes.get(
  "/vendedor",
  isAuthenticated,
  authorizeRole(["vendedor"]),
  cVendedor.dashboard
);

export default routes;
