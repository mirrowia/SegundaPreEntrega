const mongoose = require("mongoose");

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  user: { type: String },
  products: { type: Array },
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = { cartModel };
