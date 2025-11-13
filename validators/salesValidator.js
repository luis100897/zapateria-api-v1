import pool from "../config/db.js";

const validarCamposNoVacios = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return true; // Si no es un array o está vacío, consideramos que hay datos incompletos
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
      return true; // Si algún campo está vacío o solo contiene espacios, devolvemos true (datos incompletos)
    }
  }

  return false; // Si todos los campos de todos los items son válidos, devolvemos false (datos completos)
};

export const salesValidator = async (
  metodo_pago,
  items,
  total_venta_frontend
) => {
  let connection; // Declarar la conexión fuera del try

  if (validarCamposNoVacios(items)) {
    console.log("los item", items);
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
  // Obtener una conexión del pool
  connection = await pool.getConnection();

  // Iniciar la transacción
  await connection.beginTransaction();

  let total_venta = 0;
  for (const item of items) {
    const precioUnitario = parseFloat(item.precio_unitario);
    const [varianteRows] = await connection.execute(
      "SELECT id_variante, stock, precio FROM articulo_variante WHERE id_variante = ?",
      [item.id_variante]
    );
    const variante = varianteRows[0];

    if (!variante) {
      await connection.rollback(); // Rollback en caso de error de validación
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message: "Variante no valida",
      };
    }
    if (variante.stock < item.cantidad) {
      await connection.rollback(); // Rollback en caso de error de validación
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message: "No hay suficiente stock",
      };
    }
    if (item.cantidad <= 0) {
      await connection.rollback(); // Rollback en caso de error de validación
      return {
        code: 400,
        title: "Error 400: Bad Request",
        isValid: false,
        message: "La compra mínima es de 1 articulo",
      };
    }
    if (item.precio_unitario <= 0) {
      await connection.rollback(); // Rollback en caso de error de validación
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
      await connection.rollback(); // Rollback en caso de error de validación
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
      await connection.rollback(); // Rollback en caso de error de validación
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
