const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

router.use("/get", isAuth, userController.getUser);
router.use("/length", userController.getLength);

module.exports = router;
