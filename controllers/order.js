const { ObjectId } = require("mongodb");
const Order = require("../models/order");
const Session = require("../models/session");
const sendMail = require("../utils/sendMail");
const Product = require("../models/Product");

exports.postOrder = async (req, res, next) => {
  try {
    //valid
    if (req.body && String(req.body.user.name).trim().length === 0) {
      return res
        .status(422)
        .send({ message: "Vui lòng không để trống thông tin" });
    }
    if (req.body && String(req.body.user.phone).trim().length === 0) {
      return res
        .status(422)
        .send({ message: "Vui lòng không để trống thông tin" });
    }
    if (req.body && String(req.body.user.address).trim().length === 0) {
      return res
        .status(422)
        .send({ message: "Vui lòng không để trống thông tin" });
    }
    if (req.body && String(req.body.user.email).trim().length === 0) {
      return res
        .status(422)
        .send({ message: "Vui lòng không để trống thông tin" });
    }
    const checkEmail = req.body.user.email.includes("@");
    if (req.body && !checkEmail) {
      return res.status(422).send({
        ok: false,
        message: "Vui lòng nhập email chính xác",
      });
    }
    const checkPhone = Number(req.body.user.phone);
    if (req.body && !checkPhone) {
      return res.status(422).send({
        ok: false,
        message: "Vui lòng nhập Phone chính xác",
      });
    }
    const checkPrice = Number(req.body.priceAll);
    if (req.body && !checkPrice) {
      return res.status(422).send({
        ok: false,
        message: "Thông tin price không chính xác",
      });
    }
    if (req.body && req.body.items.length === 0) {
      return res.status(422).send({
        ok: false,
        message: "Thông tin items không chính xác",
      });
    }
    //end valid
    //send-mail
    const html = `<h1>Xin Chào ${req.body.user.name}</h1>
    <p>Phone: ${req.body.user.phone}</p>
    <p>Adrress: ${req.body.user.address}</p>
    <table style="border:1px solid #444">
        <thead><tr>
             <th>Tên Sản Phẩm</th>
             <th>Hình ảnh</th>
             <th>Giá</th>
             <th>Số lượng</th>
             <th>Thành Tiền</th>
        </tr></thead>
        <tbody>
        ${
          req.body.items &&
          req.body.items.map((item) => {
            return `<tr style="border:1px solid #444"><td>${item.name}</td><td><img style="width:50px" src=${item.img}alt='img/></td><td>${item.price} VND</td><td style="text-align:center"'}>${item.quantity}</td><td>${item.total} VND</td></tr>`;
          })
        }
        </tbody>
    </table>
    <h3>Tổng Thanh Toán:</h3>
    <h3>${req.body.priceAll} VND</h3>
    <div></div>
    <h4>Cảm ơn Bạn!</h4>`;
    await sendMail(req.body.user.email, "Đặt Hàng Thành Công", html);
    //cài lại count sản phẩm - quantity đặt hàng
    req.body.items.map((item) => {
      const id = new ObjectId(item.id);
      return Product.findById(id).then((p) => {
        p.count = p.count - item.quantity;
        return p.save();
      });
    });
    const session = req.body.session;
    Session.findById(session)
      .then((ss) => {
        if (ss) {
          const order = new Order({
            items: req.body.items,
            user: {
              email: ss.email,
              userId: ss.userId,
              name: req.body.user.name,
              phone: req.body.user.phone,
              address: req.body.user.address,
            },
            total: req.body.priceAll,
            delivery: "Waiting for progressing",
            status: "Waiting for pay",
          });
          return order.save().then((result) => {
            res.status(201).send({ ok: true });
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrder = (req, res, next) => {
  const id = new ObjectId(req.body.session);
  Session.findById(id)
    .then((ss) => {
      if (ss) {
        const email = ss.email;
        Order.find()
          .then((orders) => {
            return orders.filter((item) => {
              return item.user.email === email;
            });
          })
          .then((result) => {
            if (result) {
              return res.status(200).send(result);
            }
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
};

exports.editOrder = (req, res, next) => {
  const id = new ObjectId(req.body.id);
  Order.findById(id)
    .then((order) => {
      order.delivery = req.body.delivery;
      order.status = req.body.status;
      return order.save().then((rs) => {
        res.status(202).send({ edit: true });
      });
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
};

exports.getOrderDetail = (req, res, next) => {
  const id = new ObjectId(req.body.id);
  Order.findById(id).then((or) => {
    res.status(200).send(or);
  });
};

exports.getAll = (req, res, next) => {
  Order.find()
    .then((orders) => {
      res.status(200).send({ orders: orders, getAll: true });
    })
    .catch((err) => {
      res.status(500);
    });
};
