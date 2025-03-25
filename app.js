require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/db");
const cookieParser = require("cookie-parser");
const app = express();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const authRoute = require("./routes/AuthRoute");
const weatherRoute = require("./routes/WeatherRoute");
const preferencesRoute = require("./routes/PreferenceRoute");

app.use(express.json());
app.use(cookieParser());
const frontendURL = "http://localhost:3000";

app.use(
  cors({
    origin: frontendURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoute); // /api/auth/login || /api/auth/register

app.use("/api", preferencesRoute); // /api/preferences

app.use("/api", weatherRoute); // /api/weather

// Users can check temperature, humidity, wind speed, and other details.

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Weather API",
      version: "1.0.0",
      description: "Comprehensive weather data management API",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 3,
              maxLength: 30,
            },
            password: {
              type: "string",
              minLength: 6,
            },
          },
        },
        Weather: {
          type: "object",
          properties: {
            coord: {
              type: "object",
              properties: {
                lon: { type: "number", example: 35.945 },
                lat: { type: "number", example: 31.9552 },
              },
            },
            weather: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number", example: 802 },
                  main: { type: "string", example: "Clouds" },
                  description: { type: "string", example: "scattered clouds" },
                  icon: { type: "string", example: "03n" },
                },
              },
            },
            main: {
              type: "object",
              properties: {
                temp: { type: "number", example: 9.05 },
                feels_like: { type: "number", example: 4.89 },
                temp_min: { type: "number", example: 8.75 },
                temp_max: { type: "number", example: 9.05 },
                pressure: { type: "number", example: 1014 },
                humidity: { type: "number", example: 66 },
              },
            },
            visibility: { type: "number", example: 5000 },
            wind: {
              type: "object",
              properties: {
                speed: { type: "number", example: 10.29 },
                deg: { type: "number", example: 260 },
              },
            },
            clouds: {
              type: "object",
              properties: {
                all: { type: "number", example: 40 },
              },
            },
            dt: { type: "number", example: 1742431476 },
            sys: {
              type: "object",
              properties: {
                country: { type: "string", example: "JO" },
                sunrise: { type: "number", example: 1742442006 },
                sunset: { type: "number", example: 1742485637 },
              },
            },
            timezone: { type: "number", example: 10800 },
            id: { type: "number", example: 250441 },
            name: { type: "string", example: "Amman" },
            cod: { type: "number", example: 200 },
          },
        },

        Preference: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a1b2c3d4e5f6g7h8i9j0k" },
            city: { type: "string", example: "Amman" },
            user: { type: "string", example: "65a1b2c3d4e5f6g7h8i9j0l" },
            weather_data: { $ref: "#/components/schemas/Weather" },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T12:00:00Z",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions); // http://localhost:5000/api-docs

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log(`Server running on port http://localhost:${PORT}/api-docs`);
});
