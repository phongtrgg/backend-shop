const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
// require("dotenv").config();

const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const orderRouter = require("./routers/order");
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");

const app = express();
// const MONGODB_LINK = process.env.MONGO_URI;
const MONGODB_LINK =
  "mongodb+srv://phongttfx22995:phong22121998@cluster0.rbzlbjz.mongodb.net/asm3";
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(multer().single("img"));

app.use(authRouter);
app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/user", userRouter);

mongoose
  .connect(MONGODB_LINK)
  .then((result) => {
    console.log("connected");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
