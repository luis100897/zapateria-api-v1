import pool from "../config/db.js";

export const devolucionValidator = async (devolucion) => {
  const id_venta = parseInt(devolucion.id_venta);
  const id_detalle = parseInt(devolucion.id_detalle);
  let connection;

  connection = await pool.getConnection();
  await connection.beginTransaction();

  if (isNaN(devolucion.cantidad)) {
    return {
      isValid: false,
      message: "La cantidad debe de ser un valor numerico",
    };
  }
  if (devolucion.cantidad <= 0) {
    return {
      isValid: false,
      message: "La cantidad de devolución no puede ser menor a 1",
    };
  }

  // Verificamos que exista una venta con el id_detalle proporcionado.
  const [result] = await connection.execute(
    "SELECT id_detalle, cantidad, id_venta, id_variante, precio_unitario FROM detalles_venta WHERE id_detalle = ?",
    [devolucion.id_detalle]
  );
  const venta = result[0];
  console.log("resultado de la busqueda en la bd", venta);

  if (!venta) {
    await connection.rollback();
    return {
      isValid: false,
      message: "el id detalle no se encuentra asociado a ninguna venta ",
    };
  }
  if (venta.id_venta !== id_venta) {
    return {
      isValid: false,
      message: "el id detalle no coincide con el id de la venta. ",
    };
  }

  // Validamos si existe alguna devolucion con el mismo id_detalle
  const [devoluciones] = await connection.execute(
    "SELECT cantidad FROM devoluciones WHERE id_detalle = ?",
    [id_detalle]
  );
  let cantidadDevueltaPreviamente = 0;
  if (devoluciones && devoluciones.length > 0) {
    for (const devolucion of devoluciones) {
      cantidadDevueltaPreviamente += devolucion.cantidad;
    }
  }

  const cantidadTotalADevolver =
    cantidadDevueltaPreviamente + devolucion.cantidad;

  if (cantidadTotalADevolver > venta.cantidad) {
    await connection.rollback();
    return {
      isValid: false,
      message: "Los producto que intentas devolver son más de los adquiridos ",
    };
  }

  return { isValid: true, venta };
};
