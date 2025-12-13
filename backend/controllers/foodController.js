const Food = require("../models/Food");

/**
 * @desc    Get all available foods (public)
 * @route   GET /api/foods
 * @access  Public
 */
exports.getFoods = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = { isAvailable: true };

    // Search by food name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const foods = await Food.find(query).sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single food by ID
 * @route   GET /api/foods/:id
 * @access  Public
 */
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food || !food.isAvailable) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
