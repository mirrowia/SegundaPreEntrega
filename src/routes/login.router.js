const express = require("express");
const router = express.Router();
const { userModel } = require("../models/user.model");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  userModel
    .findOne({ name: username })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          const userId = user._id.toString();
          res.render("products", { user: userId });
        } else {
          res.status(404).json({ error: "Usuario no encontrado" });
        }
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    })
    .catch((err) => {
      console.error(err);
      // Aquí puedes manejar el error, como enviar una respuesta de error al cliente
    });
});

module.exports = router;
