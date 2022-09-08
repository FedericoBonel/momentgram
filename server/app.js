// Configuration imports
require("dotenv").config();
require("express-async-errors");
// Security Imports
const cors = require("cors");
// Express
const express = require('express');
// DB imports
const connectToDB = require("./src/db/Connect");
// Middleware imports
const errorHandler = require("./src/middleware/ErrorHandler");
const pathNotFoundHandler = require("./src/middleware/PathNotFound");
const requestLogger = require("./src/middleware/Logger")
//Routes imports
const authRoutes = require("./src/routes/AuthRoutes")

const PORT = process.env.PORT || 5000;
const API_BASE_URL = process.env.API_BASE_URL || "/api/v1"

const app = express();

// Security config
app.use(cors());

// Prev routing middleware
app.use(requestLogger, express.json());

// Routes
app.use(`${API_BASE_URL}/auth`, authRoutes)

// Error handling
app.use(pathNotFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectToDB(process.env.MONGODB_URI);
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    } catch (error) {
        console.log(`Problem initializing server ${error}`);
    }
}

startServer();