import db from "../models/index.js";

const { DetallesVenta, Devolucion } = db;

export const devolucionValidator = async (devolucion, connection = null) => {
  const transactionOption = connection ? { transaction: connection } : {};
  const id_venta = parseInt(devolucion.id_venta);
  const id_detalle = parseInt(devolucion.id_detalle);

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
  const ventaDetalle = await DetallesVenta.findByPk(
    id_detalle,
    transactionOption
  );
  const venta = ventaDetalle ? ventaDetalle.toJSON() : null;

  if (!venta) {
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
  const totalDevueltoResult = await Devolucion.aggregate("cantidad", "SUM", {
    where: { id_detalle: id_detalle },
    ...transactionOption,
  });
  let cantidadDevueltaPreviamente = totalDevueltoResult || 0;

  if (typeof cantidadDevueltaPreviamente === "string") {
    cantidadDevueltaPreviamente = parseInt(cantidadDevueltaPreviamente, 10);
  }

  const cantidadTotalADevolver =
    cantidadDevueltaPreviamente + devolucion.cantidad;

  if (cantidadTotalADevolver > venta.cantidad) {
    return {
      isValid: false,
      message: "Los producto que intentas devolver son más de los adquiridos ",
    };
  }

  return { isValid: true, venta };
};
