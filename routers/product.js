const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

router.use("/add", productController.addProduct);
router.use("/get", productController.getProduct);
router.use("/getDetail", productController.getDetail);
router.use("/getCategory", productController.getCategory);

module.exports = router;
