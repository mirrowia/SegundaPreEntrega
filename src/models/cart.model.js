const mongoose = require("mongoose");

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  products: [{}],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = { cartModel };
