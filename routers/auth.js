const express = require("express");
const authController = require("../controllers/auth.js");
const router = express.Router();
const { check, body } = require("validator");
const User = require("../models/user.js");

router.use("/login", authController.getLogin);
router.use("/signup", authController.getSignup);
router.use("/logout", authController.getLogout);

module.exports = router;
