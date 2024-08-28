const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/AppError");
const AdvancedFilter = require("../utilities/AdvancedFilter");
const Color=require('../models/Color')
const { findOne } = require("../models/product");

exports.createColor = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  console.log(name);
  const ColorFound = await Color.findOne({ name });
  if (ColorFound) return next(new AppError("this Color is already exist", 400));

  const color = await Color.create({
    name: req.body.name.toLowerCase(),
    user: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      color,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  let Api = new AdvancedFilter(Color.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();
  let query = Api.query;
  const Colors = await query;
  res.status(200).json({
    status: "success",
    data: {
      Colors,
    },
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const updatedColor = await Color.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedColor,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const Color = await Color.findById(req.params.id);
  if (!Color) return next(new AppError("there is no such a Color"), 404);
  res.status(200).json({
    status: "success",
    data: {
      Color,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  await Color.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Color deleted successfully",
  });
});
