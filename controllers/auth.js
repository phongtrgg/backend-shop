const User = require("../models/user");
const Session = require("../models/session");
const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const io = require("../socket");

const logoutTime = function (id) {
  console.log("ok");
  return setTimeout(function () {
    Session.findOne({ _id: id }).then((user) => {
      if (user) {
        console.log("logout");
        return Session.findByIdAndRemove(user._id);
      }
    });
  }, 10000);
};
const clear = function (id) {
  Session.findOne({ _id: id }).then((user) => {
    if (user) {
      return Session.findByIdAndRemove(user._id);
    }
  });
};

exports.getLogin = (req, res, next) => {
  if (req.body && req.body.email && req.body.password) {
    const password = req.body.password;
    const email = req.body.email;
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res
            .status(422)
            .send({ message: "Email không tồn tại !" });
        } else {
          //check pass mã hoá và tạo sesion
          bcrypt
            .compare(password, user.password)
            .then((resultPassword) => {
              if (resultPassword) {
                const date = new Date();
                const session = new Session({
                  email: user.email,
                  userId: user._id,
                  cart: user.cart,
                  timeOnline: String(date),
                });
                Session.findOne({ email: email }).then((result) => {
                  if (result) {
                    clear(result._id);
                    return session.save().then((result) => {
                      Session.findOne({ email: email }).then(
                        (currentSession) => {
                          res.status(200).send({
                            ok: true,
                            session: currentSession._id,
                            userId: user._id,
                          });
                        }
                      );
                    });
                  } else {
                    return session.save().then((rs) => {
                      Session.findOne({ email: email })
                        .then((currentSession) => {
                          res.status(200).send({
                            ok: true,
                            session: currentSession._id,
                            userId: user._id,
                          });
                          return currentSession;
                        })
                        .then((rs) => {
                          logoutTime(rs._id);
                        });
                    });
                  }
                });
              }
            });
        }
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  } else {
    res.status(400).send({ error: "no have body", status: 400 });
  }
};

exports.getSignup = (req, res, next) => {
  if (req.body && req.body.email && req.body.password) {
    const email = String(req.body.email);
    const password = req.body.password;
    const phone = req.body.phone;
    const fullname = req.body.fullname;
    User.findOne({ email: email })
      .then((resultEmail) => {
        console.log(resultEmail);
        if (resultEmail) {
          return res
            .status(422)
            .send({ message: "Email đã tồn tại !", ok: false });
        } else {
          if (!email) {
            return res.status(422).send({
              ok: false,
              message: "Vui lòng không để trống email",
            });
          }
          const checkEmail = email.includes("@");
          if (email && !checkEmail) {
            return res.status(422).send({
              ok: false,
              message: "Vui lòng nhập email chính xác",
            });
          }
          if (!phone) {
            return res.status(422).send({
              ok: false,
              message: "Vui lòng không để trống Phone",
            });
          }
          const checkPhone = Number(phone);
          if (phone && !checkPhone) {
            return res.status(422).send({
              ok: false,
              message: "Vui lòng nhập Phone chính xác",
            });
          }
          if (!fullname) {
            return res.status(422).send({
              ok: false,
              message: "Vui lòng không để trống Fullname",
            });
          }
          if (!password) {
            return res.status(422).send({
              ok: false,
              message: "Vui lòng không để trống Password",
            });
          }
          //confign valid
          //hash pass and save
          bcrypt.hash(password, 12).then((newPass) => {
            let role = req.body.role;

            if (
              req.body.role !== "admin" &&
              req.body.role !== "consultant"
            ) {
              role = "user";
            }
            const user = new User({
              email: email,
              password: newPass,
              phone: req.body.phone,
              fullname: req.body.fullname,
              role: role,
              cart: [],
            });
            return user.save().then((result) => {
              console.log("signup");
              res.status(201).send({ ok: true });
            });
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  } else {
    res.status(400).send({ error: "no have body", status: 400 });
  }
};

exports.getLogout = (req, res, next) => {
  const id = new ObjectId(req.body.session);
  if (req.body.session) {
    Session.findById(id)
      .then((result) => {
        if (result) {
          Session.findByIdAndRemove(result._id)
            .then((rs) => {
              console.log("logout");
              res.status(200).send({ ok: true, logout: true });
            })
            .catch((err) => {
              res.status(500).send({ error: err });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  } else {
    res.status(400).send({ error: "no have body", status: 400 });
  }
};

exports.getLoginAdmin = (req, res, next) => {
  console.log("login admin");
  if (req.body && req.body.email && req.body.password) {
    const password = req.body.password;
    const email = req.body.email;
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res
            .status(422)
            .send({ message: "Email không tồn tại !" });
        }
        if (
          (user && user.role === "admin") ||
          (user && user.role === "consultant")
        ) {
          //check pass mã hoá và tạo sesion
          bcrypt
            .compare(password, user.password)
            .then((resultPassword) => {
              if (resultPassword) {
                const date = new Date();
                const session = new Session({
                  email: user.email,
                  userId: user._id,
                  cart: user.cart,
                  timeOnline: String(date),
                });

                Session.findOne({ email: email }).then((result) => {
                  if (result) {
                    return Session.findOne({ email: email })
                      .then((currentSession) => {
                        res.status(200).send({
                          ok: true,
                          session: currentSession._id,
                          userId: user._id,
                          role: user.role,
                        });
                        return currentSession;
                      })
                      .then((rs) => {
                        logoutTime(rs.email);
                      });
                  } else {
                    return session.save().then((result) => {
                      Session.findOne({ email: email })
                        .then((currentSession) => {
                          res.status(200).send({
                            ok: true,
                            session: currentSession._id,
                            userId: user._id,
                            role: user.role,
                          });
                          return currentSession;
                        })
                        .then((rs) => {
                          logoutTime(rs._id);
                        });
                    });
                  }
                });
              }
            });
        } else {
          return res
            .status(422)
            .send({ message: "user không có quyền admin" });
        }
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  } else {
    res.status(400).send({ error: "no have body", status: 400 });
  }
};

exports.getSession = (req, res, next) => {
  const id = new ObjectId(req.body.userId);
  console.log(id);
  Session.findOne({ userId: id }).then((ss) => {
    let session;
    console.log(ss);
    if (ss) {
      session = ss._id;
      res.status(200).send({ session: session });
    } else {
      session = false;
      io.getIO().emit({
        action: "clearSS",
        session: session,
      });
      res.status(200).send({ session: session });
    }
  });
};
