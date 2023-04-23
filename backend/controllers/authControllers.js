const User = require("../models/user");
const cloudinary = require("cloudinary").v2;

const catchAsyncError = require("../utils/catchAsyncErrors");
const {
  BadRequest,
  UnAuthenticated,
  NotFound,
  CustomError,
} = require("../errors");
const sendToken = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Unauthenticated = require("../errors/UnAuthenticated");

// Registrar un usuario => [POST] /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Todo: Gestionar un usuario existente
  const result = await cloudinary.uploader.upload(req.body.avatar, {
    folder: "shop/users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  sendToken(user, 200, res);
});

// inicia sesion => /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequest("Please enter email and password"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new UnAuthenticated("Invalid Credentials"));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new UnAuthenticated("Invalid Credentials"));
  }

  sendToken(user, 200, res);
});

// Olvide mi contraseña => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new NotFound("User doesnt exist"));
  }

  //   Obtiene el token reseteado
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //   crea la url de la contraseña reseteada
  const resetURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow: \n\n${resetURL}\n\nIf you have not requested this email, then ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message));
  }
});

// Resetar Contraseña => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new BadRequest("Reset password token is invalid"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Unauthenticated("Password doesnt match"));
  }

  //   Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Cerrar sesion => /api/v1/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
