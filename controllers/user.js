const User = require("../models/user");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.getUser = (req, res, next) => {
  const id = new ObjectId(req.body.userId);
  User.findById(id).then((user) => {
    res.send(user);
  });
};

exports.getLength = (req, res, next) => {
  User.find().then((users) => {
    const client = users.filter((item) => {
      return item.role === "user";
    });
    const length = client.length;
    res.status(200).send({ totalUser: length, getLength: true });
  });
};
