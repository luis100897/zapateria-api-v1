import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Devolucion = sequelize.define(
  "Devolucion",
  {
    id_devolucion: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "id_devolucion",
    },
    fecha_devolucion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "fecha_devolucion",
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    metodo_reembolso: {
      type: DataTypes.ENUM("Efectivo", "Tarjeta"),
      allowNull: false,
      field: "metodo_reembolso",
    },
    monto_reembolso: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    id_empleado: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    id_venta: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    id_detalle: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "devoluciones",
    timestamps: false,
  }
);

export default Devolucion;
