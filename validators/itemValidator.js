import mArticulos from "../models/mArticulos.js";

export const validarLongitudCampos = (articulo) => {
  return articulo.nombre.length > 100 || articulo.descripcion.length > 255;
};
export const itemValidator = async (articulo) => {
  if (validarLongitudCampos(articulo)) {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      isValid: false,
      message: "La longitud de algunos campos excede el límite permitido.",
    };
  }
  const articuloExiste = await mArticulos.buscarArticuloUnico(
    articulo.nombre,
    articulo.descripcion
  );

  if (articuloExiste && articuloExiste.length > 0) {
    return {
      code: 409,
      title: "Error 409: Conflict",
      isValid: false,
      message:
        "Ya existe un articulos en la base de datos con esa información.",
    };
  }
  return { isValid: true };
};
