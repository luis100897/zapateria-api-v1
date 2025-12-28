import error from "../middlewares/error.js";
import db from "../models/index.js";
import validateFormData from "../helpers/validateFormData.js";
import trimObjectValues from "../helpers/trimObjectValues.js";
import {
  validateVariante,
  validateVarianteExist,
} from "../validators/varianteValidator.js";
import { stockVlidator } from "../validators/stockValidator.js";

const { ArticuloVariante } = db;

const cArticulosVariante = {
  crearVariante: async (req, res) => {
    try {
      const variante = trimObjectValues(req.body);

      if (!validateFormData(variante)) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: "Todos los datos son requeridos",
        });
      }
      const resultadoValidacion = await validateVariante(variante);

      if (!resultadoValidacion.isValid) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: resultadoValidacion.message,
        });
      }
      const varianteExistente = await ArticuloVariante.findOne({
        where: {
          talla: variante.talla,
          color: variante.color,
          id_articulo: variante.id_articulo,
        },
      });

      if (varianteExistente) {
        return res.status(409).json({
          code: 409,
          title: "Error 409: Conflict",
          message: `Ya existe una variante para el artículo con Talla: ${variante.talla}, Color: ${variante.color}.`,
        });
      }

      variante.stock = parseInt(variante.stock);
      variante.id_articulo = parseInt(variante.id_articulo);
      variante.precio = parseFloat(variante.precio.replace(",", "."));
      await ArticuloVariante.create(variante);
      return res.status(201).json({
        code: 201,
        title: "Created",
        message: "la variante del articulo fue creada con exito",
      });
    } catch (err) {
      console.log(err);
      return error.e500(req, res, err);
    }
  },
  obtenerListaVariantes: async (req, res) => {
    try {
      const variantes = await ArticuloVariante.findAll();
      res.status(200).json({
        code: 200,
        title: "ok",
        variantes: variantes,
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
  obtenerVariantePorId: async (req, res) => {
    try {
      const variante = await ArticuloVariante.findByPk(req.params.id);
      if (!variante) {
        return res
          .status(404)
          .json({ code: 404, message: "La variante no fue encontrada" });
      }
      res.json(variante);
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
  editarVariante: async (req, res) => {
    try {
      const variante = trimObjectValues(req.body);
      const id_variante = req.params.id;

      if (!validateFormData(variante)) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: "Todos los datos son requeridos",
        });
      }
      const resultadoValidacion = await validateVariante(variante);
      if (!resultadoValidacion.isValid) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: resultadoValidacion.message,
        });
      }

      const resultValidateVariante = await validateVarianteExist(id_variante);
      if (!resultValidateVariante.isValid) {
        return res.status(404).json({
          code: resultValidateVariante.code,
          title: resultValidateVariante.title,
          message: resultValidateVariante.message,
        });
      }

      variante.stock = parseInt(variante.stock);
      variante.id_articulo = parseInt(variante.id_articulo);
      variante.precio = parseFloat(variante.precio.replace(",", "."));
      await ArticuloVariante.update(variante, {
        where: { id_variante: id_variante },
      });
      return res.status(200).json({
        code: 200,
        title: "ok",
        message: "la variante del articulo fue editada con exito",
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
  obtenerDetallesVariantePorId: async (req, res) => {
    const id_variante = req.params.id;
    try {
      const varianteDetalles = await ArticuloVariante.findByPk(id_variante);
      if (varianteDetalles !== null) {
        return res.status(200).json({
          code: 200,
          title: "ok",
          detalles_variante: varianteDetalles,
        });
      } else {
        return res
          .status(404)
          .json({ code: 404, error: "Variante no encontrada" });
      }
    } catch (err) {
      return error.e500(req, res, err);
    }
  },

  actualizarStock: async (req, res) => {
    try {
      const id_variante = req.params.id;
      const variante = trimObjectValues(req.body);
      const cantidad = parseInt(variante.cantidad);

      if (!validateFormData(variante)) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: "Todos los datos son requeridos",
        });
      }
      const resultadoValidacion = await stockVlidator(variante, id_variante);
      if (!resultadoValidacion.isValid) {
        return res.status(404).json({
          code: resultadoValidacion.code,
          title: resultadoValidacion.title,
          message: resultadoValidacion.message,
        });
      }

      await ArticuloVariante.increment(
        { stock: cantidad },
        { where: { id_variante: id_variante } }
      );

      res.status(200).json({
        code: 200,
        title: "OK",
        message: `El stock fue actualizado con éxito`,
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
};

export default cArticulosVariante;
