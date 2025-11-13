import error from "../middlewares/error.js";
import mArticulos from "../models/mArticulos.js";
import mArticulosVariante from "../models/mArticulosVariante.js";
import pool from "../config/db.js";
import validateFormData from "../helpers/validateFormData.js";
import trimObjectValues from "../helpers/trimObjectValues.js";
import {
  validateVariante,
  validateVarianteExist,
} from "../validators/varianteValidator.js";
import { stockVlidator } from "../validators/stockValidator.js";

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
      console.log(resultadoValidacion);

      if (!resultadoValidacion.isValid) {
        return res.status(400).json({
          code: 400,
          title: "Error 400: Bad Request",
          message: resultadoValidacion.message,
        });
      }
      const varianteExistente = await mArticulosVariante.buscarVarianteUnica(
        variante.talla,
        variante.color,
        variante.id_articulo
      );

      if (varianteExistente && varianteExistente.length > 0) {
        return res.status(409).json({
          code: 409,
          title: "Error 409: Conflict",
          message: `Ya existe una variante para el artículo con Talla: ${variante.talla}, Color: ${variante.color}.`,
        });
      }

      variante.stock = parseInt(variante.stock);
      variante.id_articulo = parseInt(variante.id_articulo);
      variante.precio = parseFloat(variante.precio.replace(",", "."));
      await mArticulosVariante.crearVariante(variante);
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
      const variantes = await mArticulosVariante.obtenerListaVariantes();
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
      const variante = await mArticulosVariante.obtenerVariantePorId(
        req.params.id
      );
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
      console.log(
        "resultado de llamar a las validateVariante",
        resultadoValidacion
      );
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
      await mArticulosVariante.editarVariante(req.params.id, variante);
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
      const varianteDetalles =
        await mArticulosVariante.obtenerDetallesVariantePorId(id_variante);
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
    let connection;
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

      connection = await pool.getConnection();

      await mArticulosVariante.actualizarStockMas(
        id_variante,
        cantidad,
        connection
      );
      res.status(200).json({
        code: 200,
        title: "OK",
        message: `El stock fue actualizado con éxito`,
      });
    } catch (err) {
      return error.e500(req, res, err);
    } finally {
      if (connection) connection.release();
    }
  },
};

export default cArticulosVariante;
