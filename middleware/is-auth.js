const Session = require("../models/session");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

module.exports = (req, res, next) => {
  if (req.body && req.body.session) {
    const id = new ObjectId(req.body.session);
    Session.findById(id).then((result) => {
      if (result) {
        return next();
      }
    });
  }
  res.status(400).send({ error: "no have session", status: 400 });
};
