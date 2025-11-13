import { json } from "express";

const error = {
  e400: (req, res, err) => {
    res.status(400).json({
      code: 400,
      title: "Error 400: Bad Request",
      message: err.message,
    });
  },

  e401: (req, res, err) => {
    res.status(401).json({
      code: 401,
      title: "Error 401 Authorization Required",
      message: err.message,
    });
  },
  e403: (req, res, err) => {
    res.status(403).json({
      code: 403,
      title: "Error 403 Forbidden",
      message: err.message,
    });
  },
  e404: (req, res) => {
    res.status(404).json({
      code: 404,
      title: "Error 404 Not Found",
      message: "El recurso que estás buscando no existe.",
    });
  },
  e500: (req, res, err) => {
    res.status(500).json({
      code: 500,
      title: "Error 500 Internal Server",
      message: err.message,
    });
  },
};

export default error;
