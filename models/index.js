import { sequelize } from "../config/db.js";
import Empleado from "./Empleado.js";
import TipoEmpleado from "./TipoEmpleado.js";
import Articulo from "./Articulos.js";
import ArticuloVariante from "./ArticuloVariante.js";
import Venta from "./Ventas.js";
import DetallesVenta from "./DetallesVenta.js";
import Devolucion from "./Devoluciones.js";

TipoEmpleado.hasMany(Empleado, {
  foreignKey: "id_tipo_empleado",
  as: "empleados",
});
Empleado.belongsTo(TipoEmpleado, {
  foreignKey: "id_tipo_empleado",
  as: "tipo_empleado",
});

Articulo.hasMany(ArticuloVariante, {
  foreignKey: "id_articulo",
  as: "articulos",
});
ArticuloVariante.belongsTo(Articulo, {
  foreignKey: "id_articulo",
  as: "articulo",
});

Empleado.hasMany(Venta, {
  foreignKey: "id_empleado",
  as: "ventasRealizadas",
});
Venta.belongsTo(Empleado, {
  foreignKey: "id_empleado",
  as: "vendedor",
});

Venta.hasMany(DetallesVenta, {
  foreignKey: "id_venta",
  as: "detalles",
});
DetallesVenta.belongsTo(Venta, {
  foreignKey: "id_venta",
  as: "ventaAsociada",
});

ArticuloVariante.hasMany(DetallesVenta, {
  foreignKey: "id_variante",
  as: "detallesVenta",
});
DetallesVenta.belongsTo(ArticuloVariante, {
  foreignKey: "id_variante",
  as: "varianteAdquirida",
});

Empleado.hasMany(Devolucion, {
  foreignKey: "id_empleado",
  as: "empleado",
});
Devolucion.belongsTo(Empleado, {
  foreignKey: "id_empleado",
  as: "empleado",
});
Venta.hasMany(Devolucion, {
  foreignKey: "id_venta",
  as: "venta",
});
Devolucion.belongsTo(Venta, {
  foreignKey: "id_venta",
  as: "venta",
});
DetallesVenta.hasMany(Devolucion, {
  foreignKey: "id_detalle",
  as: "detalleVenta",
});
Devolucion.belongsTo(DetallesVenta, {
  foreignKey: "id_detalle",
  as: "detalleVenta",
});

const db = {};

db.sequelize = sequelize;
db.Empleado = Empleado;
db.TipoEmpleado = TipoEmpleado;
db.Articulo = Articulo;
db.ArticuloVariante = ArticuloVariante;
db.Venta = Venta;
db.DetallesVenta = DetallesVenta;
db.Devolucion = Devolucion;

export default db;
