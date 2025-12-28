import db from "../models/index.js";

const { ArticuloVariante } = db;

const validarCamposNoVacios = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return true;
  }
  for (const item of items) {
    const { id_variante, cantidad, precio_unitario } = item;
    if (
      !id_variante ||
      !id_variante.trim() ||
      !cantidad ||
      !cantidad.toString().trim() ||
      !precio_unitario ||
      !precio_unitario.toString().trim()
    ) {
      return true;
    }
  }

  return false; //devolvemos false (datos completos)
};

export const salesValidator = async (
  metodo_pago,
  items,
  total_venta_frontend,
  connection = null
) => {
  const transactionOption = connection ? { transaction: connection } : {};

  if (validarCamposNoVacios(items)) {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      isValid: false,
      message: "Todos los campos son requeridos",
    };
  }
  if (metodo_pago !== "Efectivo" && metodo_pago !== "Tarjeta") {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      isValid: false,
      message: "Método de pago no valido",
    };
  }

  let total_venta = 0;
  for (const item of items) {
    const precioUnitario = parseFloat(item.precio_unitario);
    const variante = await ArticuloVariante.findByPk(
      item.id_variante,
      transactionOption
    );

    if (!variante) {
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message: "Variante no valida",
      };
    }
    if (variante.stock < item.cantidad) {
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message: "No hay suficiente stock",
      };
    }
    if (item.cantidad <= 0) {
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message: "La compra mínima es de 1 articulo",
      };
    }
    if (item.precio_unitario <= 0) {
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message: "Hay un error en el precio del articulo",
      };
    }
    if (
      parseFloat(precioUnitario).toFixed(2) !==
      parseFloat(variante.precio).toFixed(2)
    ) {
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message:
          "El precio del artículo ha sido modificado. La venta no puede procesarse.",
      };
    }
    item.subtotal = parseInt(item.cantidad) * parseFloat(item.precio_unitario);
    total_venta += item.subtotal;
  }

  const totalFront = parseFloat(total_venta_frontend);

  if (!isNaN(totalFront)) {
    if (totalFront.toFixed(2) !== parseFloat(total_venta).toFixed(2)) {
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message:
          "Hay un error en el total de la venta. La venta no puede ser procesada",
      };
    }
  } else {
    return {
      code: 400,
      title: "Error 400: Bad Request",
      isValid: false,
      message: "El precio no es valido",
    };
  }
  return {
    isValid: true,
    total_venta,
  };
};
