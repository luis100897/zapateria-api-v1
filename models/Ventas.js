import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Venta = sequelize.define(
  "Venta",
  {
    id_venta: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "id_venta",
    },
    fecha_venta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "fecha_venta",
    },
    metodo_pago: {
      type: DataTypes.ENUM("Efectivo", "Tarjeta"),
      allowNull: false,
      field: "metodo_pago",
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    id_empleado: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "id_empleado",
    },
  },
  {
    tableName: "ventas",
    timestamps: false,
  }
);

export default Venta;
