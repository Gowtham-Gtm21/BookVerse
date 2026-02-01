const express = require("express");
const adminrouter = express.Router();
const {protect} =require("../middleware/authmiddleware");
const {allowRoles} =require("../middleware/authrole");
const User = require("../models/Users");
const Book = require("../models/Books");
const Order = require("../models/Orders");

// GET Dashboard Stats
adminrouter.get("/dashboard",protect,allowRoles("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalBooks = await Book.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      totalUsers,
      totalSellers,
      totalBooks,
      totalOrders,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching dashboard stats", error: err });
  }
});

module.exports = adminrouter;
