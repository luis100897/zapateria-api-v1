import mEmpleados from "../models/mEmpleados.js";
import error from "../middlewares/error.js";
import moment from "moment";
import trimObjectValues from "../helpers/trimObjectValues.js";
import validateFormData from "../helpers/validateFormData.js";
import {
  employeeValidator,
  validateEmployeeExistence,
  validateUserExist,
} from "../validators/employeeValidator.js";

const cEmpleados = {
  crearEmpleado: async (req, res, err) => {
    try {
      const empleado = trimObjectValues(req.body);

      if (!validateFormData(empleado)) {
        return res.status(400).json({
          title: "Error 400: Bad Request",
          message: "Todos los datos son requeridos",
        });
      }

      const results = await employeeValidator(empleado);
      if (!results.isValid) {
        return res.status(results.code).json({
          code: results.code,
          isValid: results.isValid,
          title: results.title,
          message: results.message,
        });
      }

      const validationExist = await validateEmployeeExistence(empleado);
      if (!validationExist.isValid) {
        return res.status(validationExist.code).json({
          code: validationExist.code,
          isValid: validationExist.isValid,
          title: validationExist.title,
          message: validationExist.message,
        });
      }

      const validationUser = await validateUserExist(empleado);
      if (!validationUser.isValid) {
        return res.status(validationUser.code).json({
          code: validationUser.code,
          isValid: validationUser.isValid,
          title: validationUser.title,
          message: validationUser.message,
        });
      }
      empleado.id_tipo_empleado = parseInt(empleado.id_tipo_empleado);
      await mEmpleados.crearEmpleado(empleado);
      res.status(201).json({
        code: 201,
        title: "Created",
        message: `El usuario "${empleado.username}" fue creado con éxito.`,
      });
    } catch (err) {
      console.log(err);
      return error.e500(req, res, err);
    }
  },

  obtenerListaEmpleados: async (req, res) => {
    try {
      const empleados = await mEmpleados.obtenerListaEmpleados();
      const empleadosFormateados = empleados.map((empleado) => {
        const fecha = moment(empleado.fecha_registro).format(
          "DD/MM/YYYY HH:mm:ss"
        );
        return {
          ...empleado,
          fecha_registro: fecha,
        };
      });

      res
        .status(200)
        .json({ code: 200, title: "ok", empleados: empleadosFormateados });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },

  obtenerEmpleadoPorId: async (req, res) => {
    try {
      const empleado = await mEmpleados.obtenerEmpleadoPorId(req.params.id);
      if (!empleado) {
        return res
          .status(404)
          .json({
            code: 404,
            title: "Not Found",
            message: "Empleado no encontrado",
          });
      }
      res.json(empleado);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener empleado" });
    }
  },

  editarEmpleado: async (req, res) => {
    try {
      const empleado = trimObjectValues(req.body);
      let id_empleado = parseInt(req.params.id);
      const result = await mEmpleados.obtenerEmpleadoPorId(id_empleado);
      if (!result) {
        return error.e404(req, res);
      }

      if (!validateFormData(empleado)) {
        return res.status(400).json({
          title: "Error 400: Bad Request",
          message: "Todos los datos son requeridos",
        });
      }

      const results = await employeeValidator(empleado);
      if (!results.isValid) {
        return res.status(results.code).json({
          code: results.code,
          isValid: results.isValid,
          title: results.title,
          message: results.message,
        });
      }

      // Validación condicional de unicidad del username
      if (empleado.username !== result.username) {
        // El username ha sido modificado, verificar si el nuevo username ya existe
        const result = await validateUserExist(empleado);

        if (!result.isValid) {
          return res.status(result.code).json({
            code: result.code,
            isValid: result.isValid,
            title: result.title,
            message: result.message,
          });
        }
      }

      empleado.id_tipo_empleado = parseInt(empleado.id_tipo_empleado);
      await mEmpleados.editarEmpleado(id_empleado, empleado);
      res.status(200).json({
        code: 200,
        title: "Ok",
        message: `El usuario "${id_empleado}" fue actualizado con éxito.`,
      });
    } catch (err) {
      error.e500(req, res, err);
    }
  },
};

export default cEmpleados;
