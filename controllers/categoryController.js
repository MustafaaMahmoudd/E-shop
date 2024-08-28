const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/AppError");
const AdvancedFilter = require("../utilities/AdvancedFilter");
const Category = require("../models/Category");
const { findOne } = require("../models/product");

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  console.log(req.file);
  const categoryFound = await Category.findOne({ name });
  if (categoryFound)
    return next(new AppError("this category is already exist", 400));

  const category = await Category.create({
    name: req.body.name.toLowerCase(),
    user: req.user.id,
    image:req.file.path
  });
  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  let Api = new AdvancedFilter(Category.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();
  let query = Api.query;
  const categories=await query
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});

exports.updateOne=catchAsync(async(req,res,next)=>{
  const updatedCategory=await Category.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  })
  res.status(200).json({
    status:"success",
    data:{
      updatedCategory
    }
  })
})

exports.getOne=catchAsync(async(req,res,next)=>{
  const category=await Category.findById(req.params.id);
  if(!category) return next(new AppError('there is no such a category'),404);
  res.status(200).json({
    status:"success",
    data:{
      category
    }
  })
})

exports.deleteOne=catchAsync(async(req,res,next)=>{
 await Category.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status:"success",
    message:"category deleted successfully"
  })
})
