const Order = require("../models/Order");
const Cart = require("../models/Cart");

/**
 * @desc    Place order from cart
 * @route   POST /api/orders
 * @access  User
 */
exports.placeOrder = async (req, res) => {
  const { deliveryAddress, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      food: item.food._id,
      name: item.food.name,
      price: item.food.price,
      quantity: item.quantity,
      image: item.food.image,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      deliveryAddress,
    });

    // Clear cart after order placed
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my
 * @access  User
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
