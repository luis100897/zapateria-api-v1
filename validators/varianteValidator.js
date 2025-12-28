import db from "../models/index.js";
const { Articulo, ArticuloVariante } = db;
const formatoPrecioRegex = /^\d{1,8}(\.\d+)?$/;
const tallaRegex = /^\d{1,2}(\.\d{1})?$/;
const colorRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;

export const validateVariante = async (variante) => {
  const articulo = await Articulo.findByPk(variante.id_articulo);
  if (!articulo) {
    return {
      isValid: false,
      message: `El articulo con el id ${variante.id_articulo} no se encuentra registrado`,
    };
  }
  if (variante.color.length > 30) {
    return {
      isValid: false,
      message: "Algunos valores superan el límite permitido",
    };
  }

  if (!tallaRegex.test(variante.talla)) {
    return {
      isValid: false,
      message:
        "El formato de la talla no es válido. Debe tener un máximo de 4 caracteres. ej: (24, 24.5, 26, 28.5)",
    };
  }

  if (!colorRegex.test(variante.color)) {
    return {
      isValid: false,
      message: "El campo color solo acepta letras, espacios y guiones (-)",
    };
  }

  const stockParse = parseInt(variante.stock);
  if (stockParse > 1000 || stockParse < 0) {
    return {
      isValid: false,
      message: "El stock no puede ser menor a 0 ni mayor a 1000",
    };
  }

  const precioParse = parseFloat(variante.precio.replace(",", "."));
  if (!formatoPrecioRegex.test(variante.precio) || precioParse === 0) {
    return {
      isValid: false,
      message:
        "El precio debe ser en formato numérico, debe de tener máximo 8 dígitos y no puede ser 0",
    };
  }
  return { isValid: true };
};

export const validateVarianteExist = async (id_variante) => {
  const varianteExiste = await ArticuloVariante.findByPk(id_variante);

  if (!varianteExiste) {
    return {
      code: 404,
      isValid: false,
      title: "Error 400: Bad Request",
      message: "la variante no se encuentra registrada",
    };
  }
  return { isValid: true };
};
