import db from "../config/db.js";

const mArticulos = {
  crearArticulo: async (articulo) => {
    try {
      const [results] = await db.query(
        "INSERT INTO articulos (nombre, descripcion) VALUES (?, ?)",
        [articulo.nombre, articulo.descripcion]
      );
      return results;
    } catch (error) {
      throw {
        status: 500,
        message: `Error al crear el articulo`,
      };
    }
  },

  obtenerListaArticulos: async () => {
    try {
      const [results] = await db.query(
        "SELECT id_articulo, nombre, descripcion, fecha_registro FROM articulos"
      );
      return results;
    } catch (error) {
      throw { status: 500, message: "Error al cargar los articulos" };
    }
  },
  //actualmente no se está implementando. Proximamente...
  obtenerArticulosPorNombre: async (nombre) => {
    try {
    } catch (error) {
      throw { status: 500, message: "Error al cargar los articulos" };
    }
  },

  obtenerArticuloPorId: async (id) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM articulos WHERE id_articulo = ?",
        id
      );
      return results[0];
    } catch (error) {
      throw { status: 500, message: "Error al obtener el articulo" };
    }
  },

  editarArticulo: async (id, articulo) => {
    try {
      const { nombre, descripcion } = articulo;
      await db.query(
        "UPDATE articulos SET nombre = ?,  descripcion = ? WHERE id_articulo = ?",
        [nombre, descripcion, id]
      );
      return { id, ...articulo };
    } catch (error) {
      console.log(error);
      throw { status: 500, message: "Error al editar el articulo." };
    }
  },
  buscarArticuloUnico: async (nombre, descripcion) => {
    try {
      const [results] = await db.query(
        "SELECT * FROM articulos WHERE nombre = ? AND descripcion = ?",
        [nombre, descripcion]
      );

      return results; // Devuelve un array de variantes coincidentes (debería ser 0 o 1)
    } catch (err) {
      console.log(err);
      throw { status: 500, message: "Error al devolver la consulta" };
    }
  },
};
export default mArticulos;
