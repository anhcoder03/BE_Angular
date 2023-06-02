
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


const register = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
    try {
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const data = await User.create({
        fullname,
        email,
        password: hashedPassword,
      });
      return res.status(200).json({
        message: "Đăng kí tài khoản thành công",
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  };


const getAllUser = async (req, res) => {
    try {
      const data = await User.find();
  
      if (!data) {
        return res.status(401).json({
          success: true,
          message: "Danh sách user trống!",
        });
      }
      const totalUser = await User.count();
      return res.status(200).json({
        success: true,
        data,
        totalUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };
  
  const getUserById = async (req, res) => {
    const id = req.params.id;
    try {
      const data = await User.findById(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy user",
        });
      }
      return res.status(200).json({
        success: true,
        data,
        message: "Thành công",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  
  const updateUser = async (req, res) => {
    const id = req.params.id;
    const formData = req.body;
    try {
      const data = await User.findByIdAndUpdate(id, formData);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy user",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Cập nhật user thành công",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  
  const removeUser = async (req, res) => {
    const id = req.params.id;
    try {
      const data = await User.findByIdAndDelete(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy user",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Xoá user thành công",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  };



  
module.exports = {
    register,
    getAllUser,
    getUserById,
    updateUser,
    removeUser,
  };