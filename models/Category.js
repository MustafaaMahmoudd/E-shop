
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // schema
    name: {
      type: String,
      required: [true, "There must be a name for each product"],
    },
    product:[{
        type:mongoose.Schema.ObjectId,
        ref:"Product",
    }],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    image: [
      {
        type: String,
        default: "http://via.placeholder.com/150",
        required:true
      },
    ],
  },
  {
    timestamps: true
  },
);

const Category=mongoose.model("Category",categorySchema)
module.exports = Category;
