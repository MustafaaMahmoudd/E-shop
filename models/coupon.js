const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      validate: {
        validator: function (val) {
          return val >= Date.now(); //16>=19
        },
        message: "startDate should not be less than current Date",
      },
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (val) {
          return val > this.startDate; //19>20
        },
        message: "endDate should not be less than startDate",
      },
      validate: {
        validator: function (val) {
          return val > Date.now();
        },
        message: "endDate ({VALUE}) should not be less than current date",
      },
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps:true,
    toJSON:{virtuals:true}
  },
);

couponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});
couponSchema.virtual("daysLeft").get(function () {
  const days=Math.ceil((this.endDate - Date.now())/(1000 * 60 * 60  * 24))+ " " + "days"
  return days;
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
