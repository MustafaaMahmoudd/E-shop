const express = require("express");
const Router = express.Router();
const brandController = require("../controllers/brandController");
const userController = require("../controllers/userController");
const isAdmin=require('../middlewares/isAdmin')

Router.route("/")
  .post(userController.protect ,brandController.createBrand)
  .get(brandController.getAll);

Router.route("/:id")
  .get(brandController.getOne)
  .patch(userController.protect,isAdmin ,brandController.updateOne)
  .delete(userController.protect, isAdmin ,brandController.deleteOne);

module.exports = Router;
