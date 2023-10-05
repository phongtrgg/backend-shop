const Product = require("../models/Product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.getProduct = (req, res, next) => {
  Product.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
};
exports.getDetail = (req, res, next) => {
  if (req.body && req.body.id) {
    const id = new ObjectId(req.body.id);
    Product.findById(id)
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send({ error: 404 });
        }
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  } else {
    res.status(400).send({ error: "no have body", status: 400 });
  }
};

exports.getCategory = (req, res, next) => {
  if (req.body.category) {
    Product.find()
      .then((products) => {
        const data = products.filter((item) => {
          return item.category === req.body.category;
        });
        return data;
      })
      .then((result) => {
        res.status(202).send(result);
      });
  } else {
    res.status(400).send({ error: "no have body", status: 400 });
  }
};
