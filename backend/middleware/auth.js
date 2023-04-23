const { UnAuthenticated, Unauthorized } = require("../errors");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Comprobar si el usuario está autenticado o no
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new UnAuthenticated("Please log in"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

// Gestión de las funciones de los usuarios
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Unauthorized(`Role ${req.user.role} is not allowed to access this`)
      );
    }
    next();
  };
};
