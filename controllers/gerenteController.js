import error from "../middlewares/error.js";

const gerenteController = {
  dashboard: async (req, res) => {
    try {
      res.json({
        message: "se abre la pantalla del gerente",
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
};

export default gerenteController;
