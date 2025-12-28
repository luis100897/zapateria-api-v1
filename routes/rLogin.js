import { Router } from "express";
import cLogin from "../controllers/loginController.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

const routes = Router();

routes.post("/login", cLogin.login);

routes.get("/logout", cLogin.logout);

routes.get("/gerente", isAuthenticated, authorizeRole(["gerente"]));

routes.get("/cajero", isAuthenticated, authorizeRole(["cajero"]));

routes.get("/vendedor", isAuthenticated, authorizeRole(["vendedor"]));

export default routes;
