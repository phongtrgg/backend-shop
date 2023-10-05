const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth-admin");

router.use("/add", isAuth, adminController.postAddProduct);
router.use("/delete", isAuth, adminController.postDeleteProduct);
router.use("/editProduct", isAuth, adminController.postEdit);
router.use("/getUser", adminController.getUser);
router.use("/deleteUser", adminController.deleteUser);

module.exports = router;
