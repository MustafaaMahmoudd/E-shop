const express = require("express");
const Router = express.Router();
const colorController = require("../controllers/colorController");
const userController = require("../controllers/userController");
const isAdmin=require('../middlewares/isAdmin')
Router.route("/")
  .post(userController.protect ,colorController.createColor)
  .get(colorController.getAll);

Router.route("/:id")
  .get(colorController.getOne)
  .patch(userController.protect, colorController.updateOne)
  .delete(userController.protect, colorController.deleteOne);

module.exports = Router;
