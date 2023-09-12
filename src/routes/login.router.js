const express = require("express");
const router = express.Router();
const { userModel } = require("../models/user.model");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  userModel.findOne({ name: username }),
    (err, user) => {
      if (!err) {
        console.log(user);
      } else {
        res.render("login");
      }
    };
});

module.exports = router;
