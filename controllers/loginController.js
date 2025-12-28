import db from "../models/index.js";
import error from "../middlewares/error.js";
import trimObjectValues from "../helpers/trimObjectValues.js";
import bcrypt from "bcrypt";
import validateFormData from "../helpers/validateFormData.js";
import jwt from "jsonwebtoken";

const { Empleado } = db;

const cLogin = {
  login: async (req, res) => {
    try {
      const data = trimObjectValues(req.body);

      if (!validateFormData(data)) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: "Todos los datos son requeridos",
        });
      }
      const { username, password } = data;

      const empleado = await Empleado.findOne({
        where: {
          username: username,
        },
      });

      if (!empleado) {
        return res.status(401).json({
          code: 401,
          title: "Error 401: Unauthorized",
          message: "Usuario o contraseña incorrectos",
        });
      }
      const empleadoData = empleado.toJSON();

      if (empleado.status !== "activo") {
        return res.status(401).json({
          code: 401,
          title: "Error 401: Unauthorized",
          message: "Tu usuario no se encuentra activado.",
        });
      }

      const isMatch = await bcrypt.compare(password, empleado.password);
      if (!isMatch) {
        return res.status(401).json({
          code: 401,
          title: "Error 401: Unauthorized",
          message: "Usuario o contraseña incorrectos",
        });
      }

      // Crear el payload del JWT
      const payload = {
        id_empleado: empleadoData.id_empleado,
        id_tipo_empleado: empleadoData.id_tipo_empleado,
        username: empleadoData.username,
        rol: empleadoData.rol,
        nombre: empleadoData.nombre,
      };

      // Generar el token JWT
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Enviar el token y los datos del usuario en una respuesta JSON
      return res.status(200).json({
        code: 200,
        title: "OK",
        message: "Inicio de sesión exitoso",
        token: token,
        user: payload,
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },

  logout: (req, res) => {
    return res.status(200).json({ message: "Sesión cerrada con éxito" });
  },
};

export default cLogin;
