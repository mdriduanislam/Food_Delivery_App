const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { registerAdmin } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Validation rules
const validateAdmin = [
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// Route: POST /api/admin/register
// Only existing admins can register new admins
router.post("/register", protect, adminOnly, validateAdmin, registerAdmin);

module.exports = router;
