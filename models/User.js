const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Each user should have name"],
    },
    email: {
      type: String,
      require: [true, "please provide your email"],
      unique: true,
      validate: [validator.isEmail, "please provide valid email"],
    },
    password: {
      type: String,
      required: [true, "please provide password"],
      select: false,
    },
    orders: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
      },
    ],
    whishLists: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "whishList",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      province: {
        type: String,
      },
      country: {
        type: String,
      },
      phone: {
        Type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);


userSchema.pre(/^find/,function(next){
  this.populate({
    path:'orders',
  })
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  password,
) {
  return await bcrypt.compare(candidatePassword, password);
};

//create model
const User = mongoose.model("User", userSchema);
module.exports = User;
