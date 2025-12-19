const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// User order routes
router.use(protect);

router.post("/", placeOrder);
router.get("/my", getMyOrders);

module.exports = router;
