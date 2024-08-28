const express = require("express");
const Router = express.Router({ mergeParams: true });
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController");

Router.route("/").post(userController.protect, reviewController.createReview);

module.exports = Router;
