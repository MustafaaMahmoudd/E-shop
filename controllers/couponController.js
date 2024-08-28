const Coupon = require("../models/coupon");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/AppError");

exports.createOne = catchAsync(async (req, res, next) => {
  //Admin create coupon
  req.body.user = req.user._id;
  const coupon = await Coupon.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      coupon,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    data: {
      coupons,
    },
  });
});
exports.getOne = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      coupon,
    },
  });
});
exports.update = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "coupon updated successfully",
    data: {
      coupon,
    },
  });
});
exports.delete = catchAsync(async (req, res, next) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "coupon deleted successfully",
  });
});
