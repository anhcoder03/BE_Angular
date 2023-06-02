const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1678720131679-14475f693cd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
    },
    admin: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Active", "Ban"],
      default: "Active",
    },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("User", User);
