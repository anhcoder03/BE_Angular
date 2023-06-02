const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dpz8j9ejx",
  api_key: "767526158633396",
  api_secret: "e4EVMtpXwY9wfHjfQARQF6I9Etc",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shop-smartphone",
    format: "png",
  },
});

module.exports = { cloudinary, storage };
