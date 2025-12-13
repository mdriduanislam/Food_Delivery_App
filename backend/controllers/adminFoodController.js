const Food = require("../models/Food");
const { validationResult } = require("express-validator");

/**
 * @desc    Create new food item
 * @route   POST /api/admin/foods
 * @access  Admin
 */
exports.createFood = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Food image is required" });
    }

    const food = await Food.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: `/uploads/foods/${req.file.filename}`,
    });

    res.status(201).json({
      message: "Food item created successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc    Update food item
 * @route   PUT /api/admin/foods/:id
 * @access  Admin
 */
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Update fields if provided
    food.name = req.body.name || food.name;
    food.description = req.body.description || food.description;
    food.price = req.body.price || food.price;
    food.category = req.body.category || food.category;
    food.isAvailable =
      req.body.isAvailable !== undefined
        ? req.body.isAvailable
        : food.isAvailable;

    // If new image uploaded, replace image
    if (req.file) {
      food.image = `/uploads/foods/${req.file.filename}`;
    }

    const updatedFood = await food.save();

    res.status(200).json({
      message: "Food item updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc    Delete food item
 * @route   DELETE /api/admin/foods/:id
 * @access  Admin
 */
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    await food.deleteOne();

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all food items (admin)
 * @route   GET /api/admin/foods
 * @access  Admin
 */
exports.getAllFoodsAdmin = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
