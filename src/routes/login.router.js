const express = require("express");
const router = express.Router();
const { userModel } = require("../models/user.model");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  userModel.findOne({ name: username }),
    (err, user) => {
      if (!err) {
        console.log(user);
      } else {
        console.log(err);
      }
    };
});

module.exports = router;
