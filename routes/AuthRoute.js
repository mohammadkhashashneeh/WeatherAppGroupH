const {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
} = require("../Controller/Users/Auth");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 *
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or existing username
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

router.route("/register").post(registerCtrl);

router.route("/login").post(loginCtrl);

router.route("/logout").post(logoutCtrl);

module.exports = router;
