const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: { type: String, slug: "name" },
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Category", categorySchema);
