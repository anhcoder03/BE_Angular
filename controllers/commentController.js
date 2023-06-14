const Comment = require("../models/Comment");
const Product = require("../models/Product");

const createComment = async (req, res) => {
  const { productId } = req.body;
  try {
    const comment = await Comment.create(req.body);
    if (comment) {
      const data = await Comment.find({ productId });
      const totalScore = data.reduce((sum, comment) => sum + comment.stars, 0);
      const reviewCount = data.length;
      const averageScore = totalScore / reviewCount;
      await Product.findById(productId).then((data) => {
        data.review_count = reviewCount;
        data.average_score = averageScore;
        data.save();
        res.status(200).json({
          message: "Đánh giá sản phẩm thành công",
          success: true,
        });
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Lỗi:" + error,
      success: false,
    });
  }
};

const getCommentById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const data = await Comment.find({ productId: productId });
    if (data.length == 0) {
      return res.status(404).json({
        message: "Không có đánh giá nào cho sản phẩm này",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(403).json("Lỗi" + error);
  }
};



const getCommentAll = async (req, res) => {
  try {
    const data = await Comment.find();
    if (data.length == 0) {
      return res.status(404).json({
        message: "Không có đánh giá nào tồn tại",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(403).json("Lỗi" + error);
  }
};

const removeComment = async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await Comment.findByIdAndDelete(commentId);
    if (comment) {
      const data = await Comment.find({ productId: comment.productId });
      const totalScore = data.reduce((sum, comment) => sum + comment.stars, 0);
      const reviewCount = data.length;
      const averageScore = totalScore / reviewCount;
      await Product.findById(comment.productId).then((data) => {
        data.review_count = reviewCount;
        data.average_score = averageScore;
        data.save();
        res.status(200).json({
          message: "Xóa đánh giá sản phẩm thành công",
          success: true,
        });
      });
    } else {
      res.status(404).json({
        message: "Không tìm thấy đánh giá",
        success: false,
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Lỗi:" + error,
      success: false,
    });
  }
};

module.exports = { createComment, getCommentById, getCommentAll, removeComment };
