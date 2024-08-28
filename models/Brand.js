
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true
  },
);

const Brand=mongoose.model("Brand",brandSchema)
module.exports = Brand;
