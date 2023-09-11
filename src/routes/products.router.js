const { Router } = require("express");
const { productModel } = require("../models/product.model");
const router = Router();

//GET
router.get("/", async (req, res) => {
  let { limit, page, sort, query } = req.query;
  try {
    const options = {};
    options.limit = limit ? limit : 10;
    if (sort) {
      sort == 1 || sort == -1
        ? (options.sort = { price: sort })
        : res.send({ error: "El valor para ordenar debe ser 1 o -1" });
    }
    if (page) options.page = page;
    query = query ? { category: query } : {};

    let products = await productModel.paginate(query, options);

    const pageNumbers = [];
    for (let i = 1; i <= products.totalPages; i++) {
      pageNumbers.push({ number: i, current: i === products.page });
    }
    let categories;
    try {
      const result = await productModel.distinct("category");
      categories = result;
      categories.push("Todas");
    } catch (error) {}

    res.render("products", {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      pageNumbers: pageNumbers,
      categories: categories,
    });

    // res.send({
    //   status: "success",
    //   payload: products.docs,
    //   totalPages: products.totalPages,
    //   prevPage: products.prevPages,
    //   nextPage: products.nextPage,
    //   page: products.page,
    //   hasPrevPage: products.hasPrevPage,
    //   hasNextPage: products.hastNextPage,
    // });
  } catch (error) {
    res.render("products", {
      status: "error",
    });
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const product = await productModel.findById(id);

    res.render("product", {
      payload: product,
    });
  } catch (error) {
    res.status({
      status: error,
    });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await productModel.distinct("category");
    res.send({
      categories: categories,
    });
  } catch (error) {
    res.render("products", {
      status: error,
    });
  }
});

// //POST
// router.post("/", async (req, res) => {
//   let { name, category, price, stock, image } = req.body;
//   if (!name || !category || !price || !stock || !image)
//     res.send({ status: "error", error: "Missing parameters" });

//   let result = await productModel.create({
//     name,
//     category,
//     price,
//     stock,
//     image,
//   });
//   res.send({ result: "success", payload: result });
// });

// //PUT
// router.put("/", async (req, res) => {
//   let { name, category, price, stock, image } = req.body;
//   if (!name || !category || !price || !stock || !image)
//     res.send({ status: "error", error: "Missing parameters" });

//   let result = await productModel.updateMany({
//     name,
//     category,
//     price,
//     stock,
//     image,
//   });
//   res.send({ result: "success", payload: result });
// });

// //DELETE
// router.delete("/", async (req, res) => {
//   let { name } = req.body;
//   if (!name) res.send({ status: "error", error: "Missing parameters" });

//   let result = await productModel.find({ name: name }).deleteOne();
//   console.log(result);
//   res.send({ result: "success", payload: result });
// });

module.exports = router;
