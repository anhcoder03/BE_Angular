const express = require("express");
const {
  createCategory,
  removeCategory,
  updateCategory,
  getAllCategory,
  getCategoryById,
} = require("../controllers/categoryController");
const route = express.Router();
const initApiRoute = (app) => {
  //category
  route.post("/create-category", createCategory);
  route.delete("/remove-category/:id", removeCategory);
  route.put("/update-category/:id", updateCategory);
  route.get("/get-all-category", getAllCategory);
  route.get("/get-category/:id", getCategoryById);
  return app.use("/api/v1", route);
};
module.exports = { initApiRoute };
