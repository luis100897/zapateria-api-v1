import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Empleado = sequelize.define(
  "Empleado",
  {
    id_empleado: {
      type: DataTypes.INTEGER.UNSIGNED, // Coincide con INT UNSIGNED en SQL
      autoIncrement: true,
      primaryKey: true,
      field: "id_empleado",
    },
    rol: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("id_tipo_empleado");
        const roleMapping = {
          1: "vendedor",
          2: "gerente",
          3: "cajero",
        };

        return roleMapping[id] || "desconocido";
      },
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido_paterno: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "apellido_paterno",
    },
    apellido_materno: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "apellido_materno",
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Mapea CURRENT_TIMESTAMP
      field: "fecha_registro",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Llave Foránea: id_tipo_empleado
    id_tipo_empleado: {
      type: DataTypes.INTEGER, // Coincide con INT en SQL
      allowNull: false,
      field: "id_tipo_empleado",
      // La referencia a 'tipo_empleado' se define en el archivo index.js
    },
    username: {
      type: DataTypes.STRING(4),
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [4, 4],
      },
    },
    status: {
      type: DataTypes.ENUM("activo", "inactivo"),
      allowNull: false,
      defaultValue: "activo",
    },
  },
  {
    tableName: "empleados",
    timestamps: false,
  }
);

export default Empleado;
