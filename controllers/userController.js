const User = require("../models/User");
const AppError = require("../utilities/AppError");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utilities/catchAsync");
const { promisify } = require("util");
const generate = require("../utilities/generateJwt");
const bcrypt = require("bcrypt");

exports.signup = catchAsync(async (req, res, next) => {
  // return next(new AppError('ok',401));
  let hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: hashedPassword,
  });
  res.status(201).json({
    newUser: user,
    status: "success",
  });
});

exports.getMe=catchAsync(async(req,res,next)=>{
  const user=await User.findById(req.user._id);
  res.status(200).json({
    status:'success',
    data:{
      user
    }
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;
  if (!password || !email) {
    return next(new AppError("you must provide your email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("your email or password is incorrect", 404));
  }
  token = generate(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Get token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log(token);
  }
  if (!token)
    return next(new AppError("You are not logged in ,please login", 401));
  //verify Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user is still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError("The user is no longer exist", 401));
  req.user = currentUser;
  next();
});

exports.updateShippingAddress = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    country,
    phone,
  } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          country,
          phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    status:'success',
    message:"user updated his shippingAddress successfully",
    data:{
      updatedUser
    }
  })
});
