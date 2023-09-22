const User = require("../models/user");
const Session = require("../models/session");
const bcrypt = require("bcryptjs");
let timeout;
const logoutTime = function (id) {
  timeout = setTimeout(function () {
    Session.findOne({ email: id }).then((user) => {
      if (user) {
        return Session.findByIdAndRemove(user._id);
      }
    });
  }, 360000);
};
const clear = function (id) {
  Session.findOne({ email: id }).then((user) => {
    if (user) {
      return Session.findByIdAndRemove(user._id);
    }
  });
};

exports.getLogin = (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).send({ message: "Email không tồn tại !" });
      } else {
        //check pass mã hoá và tạo sesion
        bcrypt.compare(password, user.password).then((resultPassword) => {
          if (resultPassword) {
            const date = new Date().getTime();
            const session = new Session({
              email: user.email,
              userId: user._id,
              cart: user.cart,
              timeOnline: String(date),
            });
            Session.findOne({ email: email }).then((result) => {
              if (result) {
                clearTimeout(timeout);
                clear(result.email);
                return session.save().then((result) => {
                  Session.findOne({ email: email })
                    .then((currentSession) => {
                      res
                        .status(200)
                        .send({ ok: true, session: currentSession._id });
                      return currentSession;
                    })
                    .then((rs) => {
                      //clear session sau 1h
                      logoutTime(rs.email);
                    });
                });
              } else {
                return session.save().then((result) => {
                  Session.findOne({ email: email })
                    .then((currentSession) => {
                      res
                        .status(200)
                        .send({ ok: true, session: currentSession._id });
                      return currentSession;
                    })
                    .then((rs) => {
                      //clear session sau 1h

                      logoutTime(rs.email);
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
};

exports.getSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const fullname = req.body.fullname;
  User.findOne({ email: email })
    .then((resultEmail) => {
      if (resultEmail) {
        res.status(422).send({ message: "Email đã tồn tại !", ok: false });
      } else {
        if (!email) {
          return res
            .status(422)
            .send({ ok: false, message: "Vui lòng không để trống email" });
        }
        const checkEmail = email.includes("@");
        if (email && !checkEmail) {
          return res
            .status(422)
            .send({ ok: false, message: "Vui lòng nhập email chính xác" });
        }
        if (!phone) {
          return res
            .status(422)
            .send({ ok: false, message: "Vui lòng không để trống Phone" });
        }
        const checkPhone = Number(phone);
        if (phone && !checkPhone) {
          return res
            .status(422)
            .send({ ok: false, message: "Vui lòng nhập Phone chính xác" });
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
          const user = new User({
            email: email,
            password: newPass,
            phone: req.body.phone,
            fullname: req.body.fullname,
            cart: [],
          });
          return user.save().then((result) => {
            res.status(201).send({ ok: true });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
};

exports.getLogout = (req, res, next) => {
  if (req.body.session) {
    Session.findByIdAndRemove(req.body.session)
      .then((rs) => {
        res.status(200).send({ ok: true });
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  }
};
