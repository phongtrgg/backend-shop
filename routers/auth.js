const express = require("express");
const authController = require("../controllers/auth.js");
const router = express.Router();
const isAuth = require("../middleware/is-auth.js");

router.use("/login", authController.getLogin);
router.use("/signup", authController.getSignup);
router.use("/logout", authController.getLogout);
router.use("/login-admin", authController.getLoginAdmin);
router.use("/getSS", authController.getSession);

module.exports = router;
