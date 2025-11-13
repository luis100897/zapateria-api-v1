import mArticulos from "../models/mArticulos.js";
import error from "../middlewares/error.js";
import moment from "moment";
import validateFormData from "../helpers/validateFormData.js";
import {
  itemValidator,
  validarLongitudCampos,
} from "../validators/itemValidator.js";
import trimObjectValues from "../helpers/trimObjectValues.js";

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

      await mArticulos.crearArticulo(articulo);
      res.status(201).json({
        code: 201,
        title: "created",
        message: "el articulo fue creado con exito",
      });
    } catch (err) {
      console.log(err);
      return error.e500(req, res, err);
    }
  },

  obtenerListaArticulos: async (req, res) => {
    try {
      const articulos = await mArticulos.obtenerListaArticulos();
      const articulosFormateados = articulos.map((articulo) => {
        const fecha = moment(articulo.fecha_registro).format(
          "DD/MM/YYYY HH:mm:ss"
        );
        return {
          ...articulo,
          fecha_registro: fecha,
        };
      });
      res.status(200).json({
        code: 200,
        title: "ok",
        message: "Lista de artículos obtenida con éxito.",
        data: articulosFormateados, //
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
      const articulo = await mArticulos.obtenerArticuloPorId(req.params.id);
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
      const id_articulo = req.params.id;

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
      const articuloExiste = await mArticulos.obtenerArticuloPorId(id_articulo);

      if (!articuloExiste) {
        return res.status(404).json({
          code: 404,
          title: "Error 404: Not Found",
          message: "El artículo que intenta editar no se encuentra registrado.",
        });
      }

      await mArticulos.editarArticulo(req.params.id, articulo);
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
