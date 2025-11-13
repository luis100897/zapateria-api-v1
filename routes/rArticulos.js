import { Router } from "express";
import cArticulos from "../controllers/articulosController.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

const router = Router();

// Ruta para agregar un nuevo artículo
router.post("/articulos", isAuthenticated, cArticulos.crearArticulo);

// Ruta para obtener la lista de productos
router.get("/articulos", isAuthenticated, cArticulos.obtenerListaArticulos);

// Ruta para obtener un artículos por nombre
//router.get("/articulos?nombre=valor", cArticulos.obtenerArticuloPorNombre);

// Ruta para obtener un artículo por ID
router.get("/articulos/:id", isAuthenticated, cArticulos.obtenerArticuloPorId);

// Ruta para editar articulo
router.put("/articulos/:id", isAuthenticated, cArticulos.EditarArticulo);

export default router;
