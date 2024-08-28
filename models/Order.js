const mongoose = require("mongoose");
const randomTxt = Math.random().toString(32).substring(7).toLocaleUpperCase();
const randomNumber = Math.floor(10000 + Math.random() * 90000);
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderItem: [
      {
        type: Object,
        required: true,
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    orderNumber: {
      type: String,
      default: randomTxt + randomNumber,
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    //for strip
    paymentStatus: {
      type: String,
      default: "Not paid",
    },
    paymentMethod: {
      type: String,
      default: "Not specified",
    },
    currency: {
      type: String,
      default: "Not specified",
    },
    //for admin
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered"],
    },
    deliverAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
