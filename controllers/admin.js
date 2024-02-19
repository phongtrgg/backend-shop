const Product = require("../models/Product");
const User = require("../models/user");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.postAddProduct = (req, res, next) => {
  const category = req.body.category;
  if (req.body.name === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (category === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (req.body.price === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (req.body.short === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (req.body.long === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (req.body.count === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  const checkPrice = Number(req.body.price);
  if (!checkPrice) {
    return res.status(422).send({
      message: "Vui lòng nhập Price chính xác",
    });
  }
  const numImg = req.body.img.length;
  let img1;
  let img2;
  let img3;
  let img4;
  if (numImg === 1) {
    img1 = req.body.img[0];
  }
  if (numImg === 2) {
    img1 = req.body.img[0];
    img2 = req.body.img[1];
  }
  if (numImg === 3) {
    img1 = req.body.img[0];
    img2 = req.body.img[1];
    img3 = req.body.img[2];
  }
  if (numImg === 4) {
    img1 = req.body.img[0];
    img2 = req.body.img[1];
    img3 = req.body.img[2];
    img4 = req.body.img[3];
  }
  const product = new Product({
    category: category,
    long_desc: req.body.long,
    name: req.body.name,
    short_desc: req.body.short,
    img1: img1,
    img2: img2,
    img3: img3,
    img4: img4,
    price: req.body.price,
    count: req.body.count,
  });
  return product
    .save()
    .then((result) => {
      console.log("created product");
      return res
        .status(201)
        .send({ ok: true, message: "created product" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });
};

exports.postEdit = (req, res, next) => {
  const category = req.body.category;
  if (req.body.name === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (category === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (req.body.price === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (req.body.short === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  if (req.body.long === "") {
    return res
      .status(422)
      .send({ message: "Vui lòng không để trống thông tin." });
  }
  const checkPrice = Number(req.body.price);
  if (!checkPrice) {
    return res.status(422).send({
      message: "Vui lòng nhập Price chính xác",
    });
  }
  if (req.body.id) {
    Product.findById(req.body.id).then((result) => {
      if (!result) {
        return res
          .status(422)
          .send({ message: "Id sản phẩm không chính xác." });
      }
      result.name = req.body.name;
      result.price = req.body.price;
      result.category = req.body.category;
      result.long_desc = req.body.long;
      result.short_desc = req.body.short;
      result.count = req.body.count;
      const numImg = req.body.img.length;
      if (numImg === 1) {
        result.img1 = req.body.img[0];
      }
      if (numImg === 2) {
        result.img1 = req.body.img[0];
        result.img2 = req.body.img[1];
      }
      if (numImg === 3) {
        result.img1 = req.body.img[0];
        result.img2 = req.body.img[1];
        result.img3 = req.body.img[2];
      }
      if (numImg === 4) {
        result.img1 = req.body.img[0];
        result.img2 = req.body.img[1];
        result.img3 = req.body.img[2];
        result.img4 = req.body.img[3];
      }
      return result.save().then((rs) => {
        res.status(202).send({ edit: true, message: "Edit thành công" });
      });
    });
  } else {
    res.status(422).send({ message: "Thiếu id sản phẩm." });
  }
};

exports.postDeleteProduct = (req, res, next) => {
  const id = new ObjectId(req.body.id);
  Product.findByIdAndRemove(id)
    .then((result) => {
      console.log("delete-P");
      res.status(202).send({ delete: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });
};

exports.getUser = (req, res, next) => {
  User.find()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });
};

exports.deleteUser = (req, res, next) => {
  const id = new ObjectId(req.body.id);
  User.findByIdAndRemove(id)
    .then((rs) => {
      res.status(202).send({ delete: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });
};
