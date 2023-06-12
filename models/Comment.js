const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    stars: { type: Number, min: 1, max: 5, require: true },
    content: { type: String, require: true },
    fullname: { type: String, require: true },
    avatar: { type: String, require: true },
    productId: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", Comment);
