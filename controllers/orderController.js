const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
  try {
    let orders = await Order
      .find({})
      .populate("allProduct.id", "productName image price")
      .populate("user", "fullname email")
      .sort({ _id: -1 });
    if (orders) {
      return res.json({ orders });
    }
  } catch (err) {
    console.log(err);
  }
};

const getOrderByUser = async (req, res) => {
  let { uId } = req.body;
  if (!uId) {
    return res.json({ message: "Ko được để trống" });
  } else {
    try {
      let order = await Order
        .find({ user: uId })
        .populate("allProduct.id", "productName image price")
        .populate("user", "fullname email")
        .sort({ _id: -1 });
      if (order) {
        return res.json({ order });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const createOrder = async (req, res) => {
  let { allProduct, user, amount, address, phone } = req.body;
  if (
    !allProduct ||
    !user ||
    !amount ||
    !address ||
    !phone
  ) {
    return res.json({ message: "Ko được để trống" });
  } else {
    try {
      let newOrder = new Order({
        allProduct,
        user,
        amount,
        address,
        phone,
      });
      let save = await newOrder.save();
      if (save) {
        return res.json({ success: "Đơn đặt hàng được tạo thành công" });
      }
    } catch (err) {
      return res.json({ error: err.message });
    }
  }
};

const updateOrder = async (req, res) => {
  let { oId, status } = req.body;
  if (!oId || !status) {
    return res.json({ message: "Ko được để trống" });
  } else {
    let currentOrder = Order.findByIdAndUpdate(oId, {
      status: status,
      updatedAt: Date.now(),
    });
    currentOrder.exec((err, result) => {
      if (err) console.log(err);
      return res.json({ success: "Đã cập nhật đơn hàng thành công" });
    });
  }
};

const removeOrder = async (req, res) => {
  let { oId } = req.body;
  if (!oId) {
    return res.json({ error: "Ko được để trống" });
  } else {
    try {
      let deleteOrder = await Order.findByIdAndDelete(oId);
      if (deleteOrder) {
        return res.json({ success: "Đã xóa đơn hàng thành công" });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  getAllOrders,
  getOrderByUser,
  createOrder,
  updateOrder,
  removeOrder,
};
