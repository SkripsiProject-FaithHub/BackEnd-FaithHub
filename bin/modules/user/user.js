const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');

const UserModel = require('./user_model');

const secretKey = process.env.SECRET_KEY;

async function registerUser(req, res) {
    const { name ,email, password, religion } = req.body;
    // console.log(req.body);
    console.log(email);
    console.log(password);
    try {
        // Validate email
        // if (!validator.isEmail(email)) {
        //     return res.status(400).json({ message: 'Invalid email address' });
        // }

        // // Validate password
        // if (!isStrongPassword(password)) {
        //     return res.status(400).json({ message: 'Password must contain at least 1 special character' });
        // }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword, religion });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '24h' });

        res.json({ token, message: 'Login success' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Couldn\'t login' });
    }
}

function isStrongPassword(password) {
    // Check if password contains at least 1 special character
    const specialChars = /[\W_]/;
    return specialChars.test(password);
}

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.userId;
        next();
    });
}

function protectedRoute(req, res) {
    res.json({ message: 'Protected route accessed', id: req.userId });
}

module.exports = {
    registerUser,
    login,
    authMiddleware,
    protectedRoute
};