const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/AppError");
const AdvancedFilter = require("../utilities/AdvancedFilter");
const Brand = require("../models/Brand");
const { findOne } = require("../models/product");

exports.createBrand = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  console.log(name);
  const BrandFound = await Brand.findOne({ name });
  if (BrandFound) return next(new AppError("this Brand is already exist", 400));

  const brand = await Brand.create({
    name: req.body.name.toLowerCase(),
    user: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      brand,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  let Api = new AdvancedFilter(Brand.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();
  let query = Api.query;
  const brands = await query;
  res.status(200).json({
    status: "success",
    data: {
      brands,
    },
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedBrand,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new AppError("there is no such a Brand"), 404);
  res.status(200).json({
    status: "success",
    data: {
      brand,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Brand deleted successfully",
  });
});
