const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // You’ll create the User model below.

// Register a new user
router.post('/register', async (req, res) => {
    const { email, phone, password, confirmPassword } = req.body;

    // Basic validations
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ email, phone, password: hashedPassword });
        const savedUser = await user.save();

        res.status(201).json({ message: "User registered successfully", user: savedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
