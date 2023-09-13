const { Router } = require("express");
const { cartModel } = require("../models/cart.model");
const { productModel } = require("../models/product.model");
const { userModel } = require("../models/user.model");
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
  const id = req.params.cid;
  try {
    const cart = await cartModel.findById(id);
    const user = await userModel.findById(cart.user);
    const promise = cart.products.map(async (product) => {
      const p = {};
      console.log(product);
      const details = await productModel.findById(product.product);
      return p;
    });
    const products = await Promise.all(promise);

    res.render("cart", {
      status: "success",
      user: user.name,
      products,
    });
  } catch (error) {}
});

//PUT
router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.body.productId;

  try {
    const product = await productModel.findById(productId);

    if (!product) res.status(404).json({ error: "No se encontro el producto" });

    if (!product.stock > 0)
      res.status(404).json({ error: "No hay stock disponible del producto" });

    const cart = await cartModel.findById(cartId);
    if (!cart)
      res
        .status(404)
        .json({ error: "No se encontro el producto para agregar" });

    cart.products.push({ product: product._id });
    const result = await cartModel.updateOne({ _id: cartId }, cart);

    res.status(200).json({ ok: "Producto agregado correctamente" });
  } catch (error) {
    console.log(error);
  }
});

//PUT
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  let stock = req.body.stock;

  try {
    //Check if stock was passed as parameter
    if (!stock) res.status(404).json({ error: "Stock no indicado" });

    //Search for cart by ID
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    //If cart exist search if the product exist in the cart
    const productIndex = cart.products.findIndex(
      (product) => product._id.toString() === pid
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    //Update product stock
    cart.products[productIndex].stock = stock;

    //Save new cart
    await cart.save();

    res.json({ message: "Producto eliminado del carrito con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }

  let result = await productModel.updateOne({
    stock,
  });
  res.send({ result: "success", payload: result });
});

//DELETE
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    //Search for cart by ID
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    //If cart exist search if the product exist in the cart
    const productIndex = cart.products.findIndex(
      (product) => product._id.toString() === pid
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    //Delete product
    cart.products.splice(productIndex, 1);

    //Save new cart
    await cart.save();

    res.json({ message: "Producto eliminado del carrito con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
