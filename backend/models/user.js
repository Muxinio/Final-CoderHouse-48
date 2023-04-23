const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Añade un Nombre"],
    maxLength: [30, "No puede semas de 30 letras"],
  },
  email: {
    type: String,
    required: [true, "Añade tu correo"],
    unique: true,
    validate: [validator.isEmail, "agrega un correo valido"],
  },
  password: {
    type: String,
    required: [true, "inserta una contraseña"],
    minlength: [6, "tu contraseña tener mas de 6 digitos"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Cifrar la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compara la contraseña de usuario
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Devuelve token JWT
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// Genera token de restablecimiento de contraseña
userSchema.methods.getResetPasswordToken = function () {
  // Genera token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash y establecer a resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Establecer la fecha de caducidad del token
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
