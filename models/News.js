const mongoose = require('mongoose');

const { Schema } = mongoose;

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
   
    date: {
      type: String,
      // default: Date.now,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('News', newsSchema);