
const Order = require("../models/Orders");

const placeOrder = async (req, res) => {
  try {
    const { userId, bookId, title, quantity, price, totalAmount, address, image } = req.body;

    // Create order with direct fields, including image
    const order = new Order({
      userId,
      bookId,
      title,
      image,
      quantity,
      price,
      totalAmount,
      address,
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days later
    });

  
    await order.save();

    return res.status(200).json({ msg: "Order placed", order });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


const myOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ orderDate: -1 });

    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    // Only the owner or an admin can delete (cancel) the order
    if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to cancel this order" });
    }

    await Order.findByIdAndDelete(id);

    return res.status(200).json({ msg: "Order cancelled" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


const orderController = { placeOrder, myOrders, deleteOrder };
module.exports=orderController;
