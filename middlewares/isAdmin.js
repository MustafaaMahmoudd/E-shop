const AppError=require('../utilities/AppError');
const User=require('../models/User')
const catchAsync=require('../utilities/catchAsync')

const isAdmin=catchAsync(async(req,res,next)=>{
    const admin=await User.findById(req.user._id);
    if(!admin.isAdmin) return next(new AppError('you are not allowed to do that',401));
    next()
})

module.exports=isAdmin