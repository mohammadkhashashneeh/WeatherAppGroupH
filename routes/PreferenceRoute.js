const {
  getAllPreferencesCtrl,
  addPreferenceCtrl,
  updatePreferenceByIdCtrl,
  deletePreferenceByIdCtrl,
} = require("../Controller/Users/Preferences");
const { authenticateToken } = require("../Middlewares/Auth");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Preferences
 *   description: Manage favorite cities
 *
 * @swagger
 * /api/preferences:
 *   get:
 *     summary: Get all favorite cities
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite cities
 *         content:
 *           application/json:
 *             example:
 *               - _id: "65a1b2c3d4e5f6g7h8i9j0k"
 *                 city: "London"
 *               - _id: "65a1b2c3d4e5f6g7h8i9j0l"
 *                 city: "Paris"
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Add new favorite city
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 example: "Berlin"
 *     responses:
 *       201:
 *         description: City added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/preferences/{id}:
 *   put:
 *     summary: Update favorite city
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65a1b2c3d4e5f6g7h8i9j0k"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newCity:
 *                 type: string
 *                 example: "Madrid"
 *     responses:
 *       200:
 *         description: City updated
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete favorite city
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65a1b2c3d4e5f6g7h8i9j0k"
 *     responses:
 *       200:
 *         description: City deleted
 *         content:
 *           application/json:
 *             example:
 *               message: "Deleted successfully"
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */

router
  .route("/preferences")
  .post(authenticateToken, addPreferenceCtrl)
  .get(authenticateToken, getAllPreferencesCtrl);

router
  .route("/preferences/:id")
  .put(authenticateToken, updatePreferenceByIdCtrl)
  .delete(authenticateToken, deletePreferenceByIdCtrl);

module.exports = router;
