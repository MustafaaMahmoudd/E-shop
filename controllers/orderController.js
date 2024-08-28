const Order = require("../models/Order");
const Product=require('../models/product');
const Coupon=require('../models/coupon')
const catchAsync = require("../utilities/catchAsync");
const User = require("../models/User");
const AppError = require("../utilities/AppError");
const stripe=require('stripe')(process.env.STRIPE_KEY);

exports.createOrder = catchAsync(async (req, res, next) => {
  //Get the payload(customer,orderItem,shippingAddress,totalPrice)
  const coupon = req.query.coupon;
  let discount,couponFound;
  if(coupon){
     couponFound=await Coupon.findOne({
      code:coupon
    });
    if(!couponFound){
      return next(new AppError('the coupon does not exist',404));
    }
    if(couponFound.isExpired){
      return next(new AppError('the coupon has expired',400));
    }
     discount=couponFound.discount/100;
  }

  const { orderItem, shippingAddress, totalPrice } = req.body;

  //find user
  const user = await User.findById(req.user._id);
  if(!user.hasShippingAddress) return next(new AppError('please provide shippingAddress',400));
  //check if order is empty
  if (orderItem.length <= 0) return next(new AppError("No order item", 400));


  //save the order into database
   const order = await Order.create({
    user: user._id,
    orderItem,
    shippingAddress,
    totalPrice:couponFound? totalPrice - totalPrice*discount : totalPrice
  });
console.log(order)
  
  //update the product quantity and totalSold
  const products=await Product.find({_id:{$in:orderItem}})
  orderItem.map(async(order)=>{
    let product=products.find((product)=>{
        let id=order._id;
        return id.toString()===(product._id).toString()
    })
    if(product){
        product.totalSold+=order.quantity;
    }
    await product.save({validateBeforeSave:false})
  })
  //push the order into user
  user.orders.push(order._id)
  await user.save({validateBeforeSave:false});
  //make payment(stripe)

const convertedOrders=orderItem.map(item=>{
  return {
    price_data:{
      currency:'usd',
      product_data:{
        name:item.name,
        description:item.description,
      },
      unit_amount:item.price * 100
    },
    quantity:item.quantity
  }
})

  const session=await stripe.checkout.sessions.create({
    line_items:convertedOrders,
    metadata:{
      orderId:JSON.stringify(order._id)
    },
    mode:'payment',
    success_url:'http://localhost/3000/success',
    cancel_url:'http://localhost/3000/cancel'
  })
  res.send({url:session.url})
  //payment webhook
  //update the user order
  res.status(201).json({
    status:"success",
    data:{
        order,
        user
    }
  })
});

exports.getAllOrders=catchAsync(async(req,res,next)=>{
  const orders=await Order.find();
  res.status(200).json({
    status:"success",
    data:{
      orders
    }
  })
})
exports.getOne=catchAsync(async(req,res,next)=>{
  const order=await Order.findById(req.params.id);
  res.status(200).json({
    status:"success",
    data:{
      order
    }
  })
})
exports.updateOne=catchAsync(async(req,res,next)=>{
  const order=await Order.findByIdAndUpdate(req.params.id,{
    status:req.body.status
  },{
    new:true,
    runValidators:true
  });
  res.status(201).json({
    status:"success",
    data:{
      order
    }
  })
})


exports.saleStatistics=catchAsync(async(req,res,next)=>{
  const sales=await Order.aggregate([{
    $group:{
      _id:null,
      totalPrice:{$sum:"$totalPrice"},
      minimumPrice:{$min:"$totalPrice"},
      maximumPrice:{$max:"$totalPrice"},
      average:{$avg:"$totalPrice"}
    }
  }
  ])
  const day=new Date();
  const today=new Date(day.getFullYear(),day.getMonth(),day.getDate());
  const saleToDay=await Order.aggregate([{
    $match:{
      createdAt:{$gte:today}
    },
  },
  {
    $group:{
      _id:null,
      totalPrice:{$sum:"$totalPrice"}
    }
  }
])
  res.status(200).json({
    status:'success',
    data:{
      // sales,
      saleToDay
    }
  })
})
