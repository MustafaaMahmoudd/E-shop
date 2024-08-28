const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/AppError");
const Product = require("../models/product");
const AdvancedFilter = require("../utilities/AdvancedFilter");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

exports.createProduct = catchAsync(async (req, res, next) => {
  console.log(req.files);
  req.body.user = req.user.id;
  const { name, category, brand } = req.body;
  //check if product is exist
  const convertedImage = req.files.map((file) => file.path);
  const productExist = await Product.findOne({ name });
  if (productExist) {
    return next(new AppError("The product is already exist", 409)); //conflict
  }

  //find category
  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound)
    return next(
      new AppError("there is no such category,please enter category", 404),
    );

  // find Brand
  const brandFound = await Brand.findOne({ name: brand.toLowerCase() });
  if (!brandFound)
    return next(
      new AppError("there is no such brand,please enter category", 404),
    );
  req.body.image = convertedImage;
  const product = await Product.create(req.body);

  //push product into category && push product into brand
  categoryFound.product.push(product._id);
  brandFound.product.push(product._id);
  await categoryFound.save({ validateBeforeSave: false });
  await brandFound.save({ validateBeforeSave: false });

  res.json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  let query;
  const Api = new AdvancedFilter(Product.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();
  query = Api.query;

  const products = await query;
  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("There is no product with such an id!", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedProduct,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "deleted successfully",
  });
});
