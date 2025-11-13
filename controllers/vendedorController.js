import error from "../middlewares/error.js";

const vendedorController = {
  dashboard: async (req, res) => {
    try {
      res.json({});
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
};

export default vendedorController;
