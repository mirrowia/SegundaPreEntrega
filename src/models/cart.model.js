const mongoose = require("mongoose");

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      },
    ],
    default: [],
  },
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = { cartModel };
