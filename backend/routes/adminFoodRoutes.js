const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createFood,
  updateFood,
  deleteFood,
  getAllFoodsAdmin,
} = require("../controllers/adminFoodController");

const upload = require("../middleware/uploadMiddleware");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Validation rules
const foodValidation = [
  body("name").notEmpty().withMessage("Food name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("image").notEmpty().withMessage("Image is required"),
];

// All admin food routes are protected
router.use(protect);
router.use(adminOnly);

// Routes
router.get("/foods", getAllFoodsAdmin);
router.post("/foods",upload.single("image"), foodValidation, createFood);
router.put("/foods/:id", updateFood);
router.delete("/foods/:id", deleteFood);

module.exports = router;
