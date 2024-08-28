const express = require("express");
const Router = express.Router();
const categoryController = require("../controllers/categoryController");
const upload=require('../config/fileUpload')
const userController = require("../controllers/userController");
const isAdmin=require('../middlewares/isAdmin')

Router.route("/")
  .post(userController.protect,upload.single('file') ,categoryController.createCategory)
  .get(categoryController.getAll);

Router.route("/:id")
  .get(categoryController.getOne)
  .patch(userController.protect, isAdmin ,categoryController.updateOne)
  .delete(userController.protect, isAdmin ,categoryController.deleteOne);

module.exports = Router;
