const express = require("express");
const router = express.Router();
const controller=require("../../controllers/client/product.controller.js")

router.get('/products',controller.product);
router.get('/products/:slug',controller.detail);

module.exports = router;