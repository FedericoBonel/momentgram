const winston = require("winston");

const level = process.env.LOG_LEVEL;

// All logging levels, a level includes all the ones before
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Colorations for different logs
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};
winston.addColors(colors);

// Use timestamps as well as json
const format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

// Define where the logs are going to be made
const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ level: "error", filename: "logs/errors.log" }),
    new winston.transports.File({ filename: "logs/all.log" }),
];

const logger = winston.createLogger({
    level,
    levels,
    format,
    transports,
});

module.exports = logger;
