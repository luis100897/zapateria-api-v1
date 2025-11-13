import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import empleadosRoutes from "./routes/rEmpleados.js";
import articulosRoutes from "./routes/rArticulos.js";
import articulosVarianteRoutes from "./routes/rArticulosVariante.js";
import ventasRoutes from "./routes/rVentas.js";
import detallesVentaRoutes from "./routes/rDetallesVenta.js";
import devolucionesRoutes from "./routes/rDevoluciones.js";
import loginRoutes from "./routes/rLogin.js";
import error from "./middlewares/error.js";

const app = express();
const port = process.env.PORT || 3001;
//const port = 3001;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", loginRoutes);
app.use("/api/v1", empleadosRoutes);
app.use("/api/v1", articulosRoutes);
app.use("/api/v1", articulosVarianteRoutes);
app.use("/api/v1", ventasRoutes);
app.use("/api/v1", detallesVentaRoutes);
app.use("/api/v1", devolucionesRoutes);

app.use((err, req, res, next) => {
  return error.e500(req, res, err);
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`);
});
