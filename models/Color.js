const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    // schema
    name: {
      type: String,
      required: [true, "There must be a name for each product"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Color = mongoose.model("Color", colorSchema);
module.exports = Color;
