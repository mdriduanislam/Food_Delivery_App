const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// Register a new admin (only accessible by existing admins)
exports.registerAdmin = async (req, res) => {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Check if email already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });

        res.status(201).json({
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
