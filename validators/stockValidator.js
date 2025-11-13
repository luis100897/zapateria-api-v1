import mArticulosVariante from "../models/mArticulosVariante.js";

export const stockVlidator = async (variante, id_variante) => {
  if (!variante.cantidad || isNaN(variante.cantidad) || variante.cantidad < 1) {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      isValid: false,
      message: "El valor debe ser un número y no puede ser 0",
    };
  }
  let detailsVariante = await mArticulosVariante.obtenerDetallesVariantePorId(
    id_variante
  );
  if (!detailsVariante) {
    return {
      code: 404,
      title: "Error 404: Not Found",
      isValid: false,
      message: "La variante no se encuentra registrada",
    };
  }
  return {
    isValid: true,
  };
};
