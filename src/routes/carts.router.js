const { Router } = require("express");
const { cartModel } = require("../models/cart.model");
const { productModel } = require("../models/product.model");
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
// router.post("/", async (req, res) => {
//   const { cart } = req.body;
//   try {
//     let cart = await cartModel.findOne({ user: user });
//     if (cart) {
//       res.status(200).json(cart);
//     } else {
//       cart = await cartModel.create({ user: user, products: [{}] });
//       res.status(201).json(cart);
//     }
//   } catch (error) {
//     console.error("Error al crear el carrito:", error);
//     res.status(500).json({ error: "Hubo un error al crear el carrito." });
//   }
// });

//PUT
router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.body.productId;

  console.log(cartId);
  console.log(productId);

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
