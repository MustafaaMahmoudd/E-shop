const express = require("express");
const Router = express.Router();
const couponController = require("../controllers/couponController");
const userController = require("../controllers/userController");
const isAdmin=require('../middlewares/isAdmin')

Router.route("/")
  .post(userController.protect, isAdmin ,couponController.createOne)
  .get(couponController.getAll);

Router.route("/:id")
  .get(couponController.getOne)
  .delete(userController.protect ,isAdmin,couponController.delete)
  .patch(userController.protect, isAdmin,couponController.update);

module.exports = Router;
