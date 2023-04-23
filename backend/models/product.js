const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Ingresa un nombre"],
    trim: true,
    maxLength: [100, "que no supere los 100 caracteres"],
  },
  price: {
    type: Number,
    required: [true, "agrega el precio"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [false, "Ingresa la descripcion del producto"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        required: false,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Seleciona una categoria"],
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "Seleciona la categoria correcta del producto",
    },
  },
  seller: {
    type: String,
    required: [true, "Agrega un vendedor!"],
  },
  stock: {
    type: Number,
    required: [true, "Agrega el stock del producto"],
  },
  numofReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
