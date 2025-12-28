import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ArticuloVariante = sequelize.define(
  "ArticuloVariante",
  {
    id_variante: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "id_variante",
    },
    talla: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    id_articulo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "id_articulo",
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "articulo_variante",
    timestamps: false,
  }
);

export default ArticuloVariante;
