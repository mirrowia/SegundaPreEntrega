const express = require("express");
const mongoose = require("mongoose");
const productRouter = require("./routes/products.router");
const cartRouter = require("./routes/carts.router");
const handlebars = require("expess-handlebars");
const app = express();
const PORT = 8080;

// Configurar Handlebars como motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

mongoose
  .connect(
    "mongodb+srv://lestian:9YTv2ykS57hAUrxa2Yh5@e-commerce.d6j4ttl.mongodb.net/e-commerce?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to Mongo Atlas DB");
  })
  .catch((error) => {
    console.log("Error!", error);
  });

// Ruta para mostrar el listado de productos con paginación
app.get("/products", async (req, res) => {
  const page = req.query.page || 1;
  const perPage = 10; // Cantidad de productos por página

  try {
    const options = {
      page: page,
      limit: perPage,
    };

    const result = await Producto.paginate({}, options);

    // Renderiza la vista "productos.handlebars" con los productos y datos de paginación
    res.render("productos", { productos: result.docs, pagination: result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos paginados" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
