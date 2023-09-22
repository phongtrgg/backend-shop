const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// require("dotenv").config();

const authRouter = require("./routers/auth");

const app = express();
const MONGODB_LINK = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

app.use(authRouter);

mongoose
  .connect(MONGODB_LINK)
  .then((result) => {
    app.listen(process.env.PORT || 5000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
