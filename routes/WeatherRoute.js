const { getWeatherDataCtrl } = require("../Controller/Weather/WeatherData");
const { authenticateToken } = require("../Middlewares/Auth");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Weather data management
 *
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get current weather data
 *     tags: [Weather]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         example: "London"
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         example: 51.5074
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         example: -0.1278
 *     responses:
 *       200:
 *         description: Weather data
 *         content:
 *           application/json:
 *             example:
 *               name: "London"
 *               main: { temp: 15.5, humidity: 65 }
 *               weather: [{ main: "Clouds", description: "overcast clouds" }]
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */

router.route("/weather").get(authenticateToken, getWeatherDataCtrl);

module.exports = router;
