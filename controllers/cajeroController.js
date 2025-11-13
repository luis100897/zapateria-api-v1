import error from "../middlewares/error.js";

const cajeroController = {
  dashboard: async (req, res) => {
    try {
      res.json({
        //usuario: req.session.user,
      });
    } catch (err) {
      return error.e500(req, res, err);
    }
  },
};

export default cajeroController;
