const express = require("express");
const Router = express.Router();
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const reviewRouter=require('../routes/reviewRouter')
const isAdmin=require('../middlewares/isAdmin')

const upload=require('../config/fileUpload')

Router.use('/:productID/reviews',reviewRouter)

Router.route("/")
  .post(userController.protect, upload.array('files'),productController.createProduct)
  .get(productController.getAllProducts);
Router.route("/:id")
  .get(productController.getOne)
  .patch(userController.protect,isAdmin ,productController.updateOne)
  .delete(userController.protect, isAdmin ,productController.deleteOne);

module.exports = Router;
