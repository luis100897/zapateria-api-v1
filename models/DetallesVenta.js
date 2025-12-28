import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const DetallesVenta = sequelize.define(
  "DetallesVenta",
  {
    id_detalle: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "id_detalle",
    },
    cantidad: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "precio_unitario",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    id_venta: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "id_venta",
    },
    id_variante: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "id_variante",
    },
  },
  {
    tableName: "detalles_venta",
    timestamps: false,
  }
);

export default DetallesVenta;
