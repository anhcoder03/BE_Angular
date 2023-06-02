const slugify = require("slugify");
const Product = require("../models/Product");
const category = require("../models/Category");

const createCategory = async (req, res) => {
  const formData = req.body;
  if (!formData.name) {
    return res.status(400).json({
      message: "Tên danh mục không được để trống!",
    });
  }
  try {
    const data = await category.findOne({ name: formData.name });
    if (data) {
      return res.status(400).json({
        success: false,
        message: "Danh mục đã tồn tại!",
      });
    }
    const newCategory = await category.create(formData);
    return res.status(200).json({
      success: true,
      message: "Tạo mới danh mục thành công!",
      data: newCategory,
    });
  } catch (error) {
    res.json(`Error: ${error}`);
  }
};

const removeCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await category.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
        success: false,
      });
    } else {
      await Product.deleteMany({ categoryId: id });
      return res.status(200).json({
        message: "Xoá danh mục thành công",
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Phải nhập tên danh mục!",
    });
  }
  try {
    const data = await category.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    } else {
      data.name = name;
      data.slug = slugify(name, { lower: true });
      await data.save();
      return res.status(200).json({
        success: true,
        message: "Cập nhật danh mục thành công!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const data = await category.find();
    if (!data) {
      return res.status(401).json({
        success: true,
        message: "Danh sách danh mục trống!",
      });
    }
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getCategoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await category.findById(id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  createCategory,
  removeCategory,
  updateCategory,
  getAllCategory,
  getCategoryById,
};
