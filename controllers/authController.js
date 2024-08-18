const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel');

exports.register = async (req, res) => {
    const { username, password, role, email } = req.body;

    // Validate input
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    // Check if the username or email already exists
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Username or email already taken' });
    }

    let hashedPassword;
    try {
        // Hash the password
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        return res.status(500).json({ message: 'Error hashing password' });
    }

    const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword,
        role
    };

    // Add the new user to the in-memory store
    users.push(newUser);

    let token;
    try {
        // Create a JWT token
        token = jwt.sign(
            { userId: newUser.id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    } catch (error) {
        return res.status(500).json({ message: 'Error generating JWT token' });
    }

    return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }
    });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Find the user
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
};
