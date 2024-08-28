const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // schema
    name: {
      type: String,
      required: [true, "There must be a name for each product"],
    },
    description: {
      type: String,
      required: [true, "Each product must have description"],
    },
    brand: {
      type: String,
      required: [true, "Each product must have brand"],
    },
    category: {
      type: String,
      required: [true, "Each product must belong to specific category"],
    },
    size: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: [true, "size is required"],
    },
    color: {
      type: [String],
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    review: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

productSchema.pre(/^find/,function(next){
  this.populate({
    path:"review"
  })
  next()
})


productSchema.virtual('totalReviews').get(function(){
  return this.review.length
})
productSchema.virtual('quantityLeft').get(function(){
  return this.totalQuantity-this.totalSold
})
productSchema.virtual('averageReview').get(function(){
   let totalRating=0;
   this.review.forEach(review=>{
    totalRating+=review.rating;
   })
   let averageRating=Number(totalRating/this.review.length.toFixed(1)) //to convert into one decimal number
   return averageRating
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
