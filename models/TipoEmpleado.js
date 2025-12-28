import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const TipoEmpleado = sequelize.define(
  "TipoEmpleado",
  {
    id_tipo_empleado: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_tipo_empleado", //Mantiene el nombre de columna de MySQL
    },
    tipo_empleado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "tipo_empleado",
    },
  },
  {
    tableName: "tipo_empleado", //Nombre exacto de tu tabla en MySQL
    timestamps: false,
  }
);

export default TipoEmpleado;
