const Session = require("../models/session");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const io = require("../socket");

module.exports = (req, res, next) => {
  if (req.body && req.body.session) {
    const id = new ObjectId(req.body.session);
    Session.findById(id).then((result) => {
      if (result) {
        console.log("is-Auth:ok");
        return next();
      }
      if (!result) {
        console.log("is-Auth:false");
        res.send({ error: "no have session", status: 400 });
      }
    });
  } else {
    res.send({ error: "no have session", status: 400 });
  }
};
