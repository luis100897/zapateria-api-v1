import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Articulo = sequelize.define(
  "Articulo",
  {
    id_articulo: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "id_articulo",
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Mapea CURRENT_TIMESTAMP
      field: "fecha_registro",
    },
  },
  {
    tableName: "articulos",
    timestamps: false,
  }
);

export default Articulo;
