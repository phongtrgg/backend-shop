const Session = require("../models/session");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const io = require("../socket");
const User = require("../models/user");

module.exports = (req, res, next) => {
  if (req.body && req.body.session) {
    const id = new ObjectId(req.body.session);
    Session.findById(id).then((result) => {
      if (result) {
        const userId = result.userId;
        User.findById(userId).then((user) => {
          if (user && user.role === "admin") {
            console.log("auth-ok");
            return next();
          } else {
            console.log("is-Auth:false");
            res.send({ error: "user không có quyền admin", status: 400 });
          }
        });
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
