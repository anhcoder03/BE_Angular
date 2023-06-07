const News = require("../models/News");

const createNews = async (req, res) => {
  const formData = req.body;
  if (!formData.title || !formData.description || !formData.date || !formData.image) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin tin tức",
    });
  }
  try {
    const newNews = await News.create(formData);
    return res.status(201).json({
      success: true,
      message: "Tạo tin tức thành công!",
      data: newNews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server! Không thể tạo tin tức!",
    });
  }
};

const getAllNews = async (req, res) => {
  try {
    const newsList = await News.find({}).sort("-createdAt");
    if (!newsList) {
      return res.status(404).json({
        success: false,
        message: "Không có tin tức nào!",
      });
    }
    return res.status(200).json({
      success: true,
      data: newsList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server! Không thể lấy tin tức!",
    });
  }
};

const getNewsById = async (req, res) => {
  const id = req.params.id;
  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tin tức!",
      });
    }
    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server! Không thể lấy tin tức!",
    });
  }
};

const updateNews = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  if (!updateData.title  || !updateData.description || !updateData.date || !updateData.image) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin tin tức",
    });
  }
  try {
    const updatedNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedNews) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tin tức để cập nhật!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cập nhật tin tức thành công!",
      data: updatedNews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server! Không thể cập nhật tin tức!",
    });
  }
};

const removeNews = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tin tức để xoá!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Xoá tin tức thành công!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server! Không thể xoá tin tức!",
    });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  removeNews,
}