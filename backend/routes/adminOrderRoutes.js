const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/adminOrderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin order routes
router.use(protect);
router.use(adminOnly);

router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);

module.exports = router;
