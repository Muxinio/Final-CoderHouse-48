const catchAsyncErrors = require("../utils/catchAsyncErrors");
const User = require("../models/user");
const sendToken = require("../utils/jwt");
const cloudinary = require("cloudinary").v2;
// Obtener los datos del usuario conectado actualmente => [GET] /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Actualizar / Cambiar contraseña => [PUT] /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new BadRequest("Password is incorrect"));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//Actualiza / Actualiza perfil de usuario => [PUT] /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //   Actualizar avatar: ToDO
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const image_id = user.avatar.public_id;
    const res = await cloudinary.uploader.destroy(image_id);

    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "shop/users",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Rutas del Admin
// Obtener todos los usuarios => [GET] /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Obtener datos del usuario => [GET] /api/v1/admin/users/:id
exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new NotFound(`Cannot be found user with id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Actualiza / Actualiza perfil de usuario => [PUT] /api/v1/admin/users/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

// elmiina el usuario => [DELETE] /api/v1/admin/user/:id
exports.deleteUserDetail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new NotFound(`Cannot be found user with id: ${req.params.id}`));
  }

  // Eliminar avatar de cloudinary - TODO
  const image_id = user.avatar.public_id;
  await cloudinary.uploader.destroy(image_id);

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
