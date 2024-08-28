const Review = require("../models/Review");
const Product = require("../models/product");
const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.product = req.params.productID;
  const productId = req.params.productID;
  const productFound = await Product.findById(productId)
  if (!productFound)
    return next(new AppError("There is no product with this id"));
  //check if product is reviewed by user before
const hasReviewed=productFound.review.find((review)=>{
  return review.user.toString()===req.user._id.toString()
})
if(hasReviewed) return next(new AppError("you have already reviewed that product before",409));

  //create review
  const review = await Review.create(req.body);
  //push review into product
  productFound.review.push(review._id);
  await productFound.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});
