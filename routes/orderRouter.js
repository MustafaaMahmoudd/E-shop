const express = require("express");
const Router = express.Router();
const orderController = require("../controllers/orderController");
const userController = require("../controllers/userController");
const isAdmin=require('../middlewares/isAdmin')

Router.route("/").post(userController.protect, isAdmin ,orderController.createOrder);

Router.route("/").get(userController.protect, orderController.getAllOrders);
Router.route("/:id")
  .get(userController.protect ,orderController.getOne)
  .patch(userController.protect, isAdmin,orderController.updateOne);

Router.route('/sales/sum').get(userController.protect,orderController.saleStatistics)

module.exports = Router;
