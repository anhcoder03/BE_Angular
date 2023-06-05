const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

let refreshTokens = [];

const creacteAccessToken = (payload) => {
  return jwt.sign(
    { id: payload._id, admin: payload.admin },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
const creacteRefreshToken = (payload) => {
  return jwt.sign(
    { id: payload._id, admin: payload.admin },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

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

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Vui lòng điền đầy đủ thông tin");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không khớp" });
    }
    const accessToken = creacteAccessToken(user);
    const refreshToken = creacteRefreshToken(user);
    refreshTokens.push(refreshToken);
    console.log(refreshTokens);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      user,
      accessToken,
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

const createNewRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshTokens);
  if (!refreshToken) return res.status(401).json("You're not authenticated");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    //Create new access token, refresh token
    const newAccessToken = creacteAccessToken(user);
    const newRefreshToken = creacteRefreshToken(user);
    refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ accessToken: newAccessToken });
  });
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.cookies.refreshToken
  );
  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công!",
  });
};

module.exports = {
  register,
  getAllUser,
  getUserById,
  updateUser,
  removeUser,
  creacteAccessToken,
  logout,
  createNewRefreshToken,
  login,
};
