import db from "../models/index.js";
import error from "../middlewares/error.js";
import moment from "moment";
import validateFormData from "../helpers/validateFormData.js";
import trimObjectValues from "../helpers/trimObjectValues.js";
import {
  itemValidator,
  validarLongitudCampos,
} from "../validators/itemValidator.js";
const { Articulo } = db;

const cArticulos = {
  crearArticulo: async (req, res) => {
    try {
      const articulo = trimObjectValues(req.body);

      if (!validateFormData(articulo)) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: "Todos los datos son requeridos",
        });
      }
      const result = await itemValidator(articulo);
      if (!result.isValid) {
        return res.status(result.code).json({
          code: result.code,
          title: result.title,
          message: result.message,
        });
      }

      await Articulo.create(articulo);
      res.status(201).json({
        code: 201,
        title: "created",
        message: "el articulo fue creado con exito",
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },

  obtenerListaArticulos: async (req, res) => {
    try {
      const articulos = await Articulo.findAll();
      const articulosFormateados = articulos.map((articulo) => {
        const data = articulo.toJSON();
        const fecha = moment(data.fecha_registro).format("DD/MM/YYYY HH:mm:ss");
        return {
          ...data,
          fecha_registro: fecha,
        };
      });
      res.status(200).json({
        code: 200,
        title: "ok",
        message: "Lista de artículos obtenida con éxito.",
        data: articulosFormateados,
        total: articulosFormateados.length,
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
  //actualmente no se está implementando. Proximamente...
  obtenerArticuloPorNombre: async (req, res) => {
    try {
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
  //actualmente no se está implementando. Proximamente...
  obtenerArticuloPorId: async (req, res) => {
    try {
      const articulo = await Articulo.findByPk(req.params.id);
      if (!articulo) {
        return res.status(404).json({
          code: 404,
          title: "Error 404: Not Found",
          message: "El artículo solicitado no fue encontrado.",
        });
      }
      res.json(articulo);
    } catch (err) {
      return error.e500(req, res, err);
    }
  },

  EditarArticulo: async (req, res) => {
    try {
      const articulo = trimObjectValues(req.body);
      const id_articulo = parseInt(req.params.id);

      if (!validateFormData(articulo)) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: "Todos los datos son requeridos",
        });
      }
      if (validarLongitudCampos(articulo)) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: "La longitud de algunos campos excede el límite permitido.",
        });
      }
      const articuloExiste = await Articulo.findByPk(id_articulo);
      if (!articuloExiste) {
        return res.status(404).json({
          code: 404,
          title: "Error 404: Not Found",
          message: "El artículo que intenta editar no se encuentra registrado.",
        });
      }

      await Articulo.update(articulo, {
        where: {
          id_articulo: id_articulo,
        },
      });
      res.status(200).json({
        code: 200,
        title: "ok",
        message: "El articulo fue actualizado con éxito.",
      });
    } catch (err) {
      console.log(err);
      return error.e500(req, res, err);
    }
  },
};

export default cArticulos;
