const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const isAuth = require("../middleware/is-auth");

router.use("/post", isAuth, orderController.postOrder);
router.use("/get", isAuth, orderController.getOrder);
router.use("/getDetail", isAuth, orderController.getOrderDetail);
router.use("/getAll", orderController.getAll);
router.use("/edit", orderController.editOrder);

module.exports = router;
