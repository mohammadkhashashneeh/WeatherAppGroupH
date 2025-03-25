const { User, registerSchema, loginSchema } = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @param {string} req.body.username.required - Username (3-30 characters)
 * @param {string} req.body.password.required - Password (min 6 characters)
 * @returns {object} 200 - Success response with JWT token
 * @returns {object} 400 - Validation error or existing username
 * @returns {object} 500 - Server error
 * @example
 * // Sample request:
 * {
 *   "username": "john_doe",
 *   "password": "secret123"
 * }
 *
 * // Sample response:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
const registerCtrl = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Logged in" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * @route POST /api/auth/login
 * @desc Authenticate existing user
 * @access Public
 * @param {string} req.body.username.required - Registered username
 * @param {string} req.body.password.required - User's password
 * @returns {object} 200 - Success response with JWT token
 * @returns {object} 400 - Invalid credentials
 * @returns {object} 500 - Server error
 * @example
 * // Sample request:
 * {
 *   "username": "john_doe",
 *   "password": "secret123"
 * }
 *
 * // Sample response:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
const loginCtrl = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "تم الدخول بنجاح" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 */
const logoutCtrl = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.json({ message: "Loggedout" });
};

module.exports = {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
};
