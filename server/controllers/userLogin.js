import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

};

// Email regex: ensures the email contains a valid domain
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|io)$/;

// joi for form validation
const userSchema = Joi.object({
    name: Joi.string().min(3)
    .max(30).required()
    .messages({ "string.empty": "Name is required.",
    "string.min": "Name should be at least 3 characters long.",
    "string.max": "Name cannot exceed 30 characters.",
    }),
    email: Joi.string()
    .pattern(emailRegex)
    .required()
    .messages({ "string.pattern.base": "Email must have @gmail.com or.com,.org,.net",}),

    password: Joi.string().min(6)
    .required()
    .messages({ "string.empty": "Password is required.",
        "string.min": "Password must be at least 6 characters long."
    }),
});


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
          // Validate request body using Joi
  const { error } = userSchema.validate(req.body,{ abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(err => err.message);
    return res.status(400).json({ errors: errorMessages });
  }
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        
        await user.save();
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                message: "User created successfully",
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                message: "Login successful",
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
