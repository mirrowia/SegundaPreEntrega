const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = { userModel };
