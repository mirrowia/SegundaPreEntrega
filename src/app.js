const express = require("express");
const mongoose = require("mongoose");
const productRouter = require("./routes/products.router");
const cartRouter = require("./routes/carts.router");
const handlebars = require("express-handlebars");
var path = require("path");
const app = express();
const PORT = 8080;

// Configurar Handlebars como motor de plantillas
app.engine(
  "handlebars",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/",
  })
);
app.set("views", path.join(__dirname + "/views"));
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
