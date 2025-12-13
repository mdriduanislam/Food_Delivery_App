const Cart = require("../models/Cart");
const Food = require("../models/Food");

/**
 * @desc    Get logged-in user's cart
 * @route   GET /api/cart
 * @access  User
 */
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.food",
      "name price image"
    );

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  User
 */
exports.addToCart = async (req, res) => {
  const { foodId, quantity } = req.body;

  try {
    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable) {
      return res.status(404).json({ message: "Food not available" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ food: foodId, quantity: quantity || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.food.toString() === foodId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ food: foodId, quantity: quantity || 1 });
      }

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:foodId
 * @access  User
 */
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== req.params.foodId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  User
 */
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
