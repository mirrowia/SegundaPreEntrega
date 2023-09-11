const { Router } = require("express");
const { cartModel } = require("../models/cart.model");
const router = Router();

//GET
router.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los carritos" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
  } catch (error) {}
});

//POST Crea o trae el cart de un usuario indicado
router.post("/", async (req, res) => {
  const { user } = req.body;
  try {
    let cart = await cartModel.findOne({ user: user });
    if (cart) {
      res.status(200).json(cart);
    } else {
      cart = await cartModel.create({ user: user, products: [{}] });
      res.status(201).json(cart);
    }
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Hubo un error al crear el carrito." });
  }
});

//PUT
router.put("/:cid", async (req, res) => {
  let { name, category, price, stock, image } = req.body;
  if (!name || !category || !price || !stock || !image)
    res.send({ status: "error", error: "Missing parameters" });

  let result = await productModel.updateMany({
    name,
    category,
    price,
    stock,
    image,
  });
  res.send({ result: "success", payload: result });
});

router.put("/:cid/products/:pid", async (req, res) => {
  let { stock } = req.body;
  if (!stock) res.send({ status: "error", error: "Missing parameters" });

  let result = await productModel.updateOne({
    stock,
  });
  res.send({ result: "success", payload: result });
});

// //DELETE
// router.delete("/", async (req, res) => {
//   let { name } = req.body;
//   if (!name) res.send({ status: "error", error: "Missing parameters" });

//   let result = await productModel.find({ name: name }).deleteOne();
//   console.log(result);
//   res.send({ result: "success", payload: result });
// });

//DELETE
router.delete("/:cid/products/:pid", async (req, res) => {
  let { cid, pid } = req.params;
});

module.exports = router;
