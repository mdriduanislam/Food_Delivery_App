const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// All cart routes require login
router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:foodId", removeFromCart);
router.delete("/", clearCart);

module.exports = router;
