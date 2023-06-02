const express = require("express");
const {
  createCategory,
  removeCategory,
  updateCategory,
  getAllCategory,
  getCategoryById,
} = require("../controllers/categoryController");
const {
  createProduct,
  updateProduct,
  removeProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");
const {
  register,
  updateUser,
  removeUser,
  getAllUser,
  getUserById,
} = require("../controllers/authController");
const { uploadImage, deleteImage } = require("../controllers/uploadController");

const { storage } = require("../config/cloudinary");
const multer = require("multer");
const upload = multer({ storage: storage });
const route = express.Router();

const initApiRoute = (app) => {
  //image
  route.post("/upload-image", upload.array("image", 10), uploadImage);
  route.delete("/delete-image/:publicId", deleteImage);

  //category
  route.post("/create-category", createCategory);
  route.delete("/remove-category/:id", removeCategory);
  route.put("/update-category/:id", updateCategory);
  route.get("/get-all-category", getAllCategory);
  route.get("/get-category/:id", getCategoryById);

  //product
  route.post("/create-product", createProduct);
  route.put("/update-product/:id", updateProduct);
  route.delete("/remove-product/:id", removeProduct);
  route.get("/getProducts", getProducts);
  route.get("/getProduct/:id", getProductById);

  //User
  route.post("/register-user", register);
  route.put("/update-user/:id", updateUser);
  route.delete("/remove-user/:id", removeUser);
  route.get("/getUser", getAllUser);
  route.get("/getUser/:id", getUserById);

  return app.use("/api/v1", route);
};
module.exports = { initApiRoute };
