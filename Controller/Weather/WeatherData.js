require("dotenv").config();
const axios = require("axios");
const Joi = require("joi");

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "none";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const weatherSchema = Joi.alternatives().try(
  Joi.object({
    city: Joi.string().min(2).required(),
  }),
  Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lon: Joi.number().min(-180).max(180).required(),
  })
);

/**
 * @route GET /api/weather
 * @desc Get current weather data by city name or coordinates
 * @access Private
 * @header Authorization: Bearer <token>
 * @param {string} req.query.city - City name (either city OR lat+lon required)
 * @param {number} req.query.lat - Latitude (either city OR lat+lon required)
 * @param {number} req.query.lon - Longitude (either city OR lat+lon required)
 * @returns {object} 200 - Weather data from OpenWeather API
 * @returns {object} 400 - Validation error
 * @returns {object} 401 - Unauthorized (invalid API key)
 * @returns {object} 404 - City not found
 * @returns {object} 500 - Server error
 * @example
 * // Sample city request:
 * GET /api/weather?city=London
 *
 * // Sample coordinates request:
 * GET /api/weather?lat=51.5074&lon=-0.1278
 *
 * // Sample response:
 * {
 *   "coord": { "lon": -0.1278, "lat": 51.5074 },
 *   "weather": [{ "id": 800, "main": "Clear", "description": "clear sky" }],
 *   "main": { "temp": 22.5, "feels_like": 22.8, "temp_min": 21.3, "temp_max": 23.7 },
 *   "name": "London"
 * }
 */
const getWeatherDataCtrl = async (req, res) => {

  const { error } = weatherSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { city, lat, lon } = req.query;

  try {
    const params = {
      appid: OPENWEATHER_API_KEY,
      units: "metric",
    };

    if (city) {
      params.q = city;
    } else if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }

    
    const response = await axios.get(OPENWEATHER_BASE_URL, { params });

    res.json(response.data);
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data || "Failed to fetch weather data" });
  }
};

module.exports = {
  getWeatherDataCtrl,
};
