import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.MYSQLPORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: 0,
});

//export default pool;
//se tiene que liminar la conexion anterior
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOS,
    dialect: "mysql",
    port: process.env.MYSQLPORT || 3306,
    logging: false,
    define: {
      freezeTableName: true, //evita que Sequelize pluralice automáticamente los nombres de tabla
    },
  }
);
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Conexión a la base de datos (Sequelize) establecida correctamente."
    );
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error.message);
    // Puedes reintentar o salir de la aplicación si la conexión es crítica
  }
};

export { sequelize, connectDB };

/* datos de la bd de produccion
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0,
});

export default pool;
*/
