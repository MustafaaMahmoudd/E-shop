const userController = require("../controllers/userController");
const express = require("express");
const isAdmin=require('../middlewares/isAdmin')
const Router = express.Router();

Router.post("/signup", userController.signup);
Router.get("/login", userController.login);
Router.get('/me',userController.protect,userController.getMe);
Router.put(
  "/update/shipping",
  userController.protect,
  isAdmin,
  userController.updateShippingAddress,
);

module.exports = Router;
