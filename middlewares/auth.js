import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      title: "Error 401: Unauthorized",
      message: "Acceso no autorizado. Se requiere un token.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        title: "Error 403: Forbidden",
        message: "Token inválido o expirado. Debes iniciar sesión nuevamente",
      });
    }
    req.user = user;
    next();
  });
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.rol)) {
      return next();
    }
    return res.status(403).json({
      title: "Error 403: Forbidden",
      message: "No tienes permiso para acceder a este recurso.",
    });
  };
};
