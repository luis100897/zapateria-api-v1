import db from "../config/db.js";

const mArticulosVariante = {
  crearVariante: async (variante) => {
    try {
      const [results] = await db.query(
        "INSERT INTO articulo_variante (talla, color, stock, id_articulo, precio) VALUES (?, ?, ?, ?, ?)",
        [
          variante.talla,
          variante.color,
          variante.stock,
          variante.id_articulo,
          variante.precio,
        ]
      );
      return results;
    } catch (error) {
      throw {
        status: 500,
        message: `Error al crear la variante del articulo.`,
      };
    }
  },
  obtenerListaVariantes: async () => {
    try {
      const [results] = await db.query(
        "SELECT id_variante, talla, color, stock, id_articulo, precio FROM articulo_variante"
      );
      return results;
    } catch (error) {
      throw { status: 500, message: "Error al cargar los articulos" };
    }
  },
  obtenerVariantePorId: async (id_variante, connection) => {
    try {
      connection = await db.getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM articulo_variante WHERE id_variante = ?",
        [id_variante]
      );
      return rows[0];
    } catch (error) {
      throw { status: 500, message: "Error al cargar el articulo buscado" };
    } finally {
      if (connection) connection.release();
    }
  },
  editarVariante: async (id, variante) => {
    try {
      const { talla, color, stock, precio } = variante;
      await db.query(
        "UPDATE  articulo_variante SET talla = ?,  color = ?, stock = ?, precio = ? WHERE id_variante = ?",
        [talla, color, stock, precio, id]
      );
      return { id, ...variante };
    } catch (error) {
      console.log(error);
      throw { status: 500, message: "Error al editar la variante." };
    }
  },
  buscarVarianteUnica: async (talla, color, id_articulo) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM articulo_variante WHERE talla = ? AND color = ? AND id_articulo = ?",
        [talla, color, id_articulo]
      );
      return results; // Devuelve un array de variantes coincidentes (debería ser 0 o 1)
    } catch (err) {
      throw { status: 500, message: "Error al devolver la consulta" };
    }
  },
  actualizarStock: async (id_variante, cantidad, connection) => {
    try {
      const [results] = await connection.execute(
        "UPDATE articulo_variante SET stock = stock - ? WHERE id_variante = ?",
        [cantidad, id_variante]
      );
      return results;
    } catch (error) {
      throw { status: 500, message: "Error al actualizar el stock" };
    } finally {
      if (connection) connection.release();
    }
  },
  actualizarStockMas: async (id_variante, cantidad, connection) => {
    try {
      const [results] = await connection.execute(
        "UPDATE articulo_variante SET stock = stock + ? WHERE id_variante = ?",
        [cantidad, id_variante]
      );
      return results;
    } catch (error) {
      throw { status: 500, message: "Error al actualizar el stock." };
    } finally {
      if (connection) connection.release();
    }
  },
  obtenerDetallesVariantePorId: async (id_variante) => {
    try {
      const [rows] = await db.execute(
        "SELECT talla, color, stock, precio FROM articulo_variante WHERE id_variante = ?",
        [id_variante]
      );
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null; // Indica que no se encontró la variante
      }
    } catch (error) {
      throw error; // Re-lanza el error para que lo capture el controlador
    }
  },
};

export default mArticulosVariante;
