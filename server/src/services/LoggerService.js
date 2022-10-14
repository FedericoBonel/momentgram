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

// Use timestamps as well as json
const format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
);

// Filters to separate loggins into different files
const errorFilter = winston.format((info, opts) => {
    return info.level === "error" ? info : false;
});

const warnFilter = winston.format((info, opts) => {
    return info.level === "warn" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
    return info.level === "info" ? info : false;
});

const httpFilter = winston.format((info, opts) => {
    return info.level === "http" ? info : false;
});

const debugFilter = winston.format((info, opts) => {
    return info.level === "debug" ? info : false;
});

// Define where the logs are going to be made
const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        level: "error",
        filename: "logs/errors.log",
        format: winston.format.combine(errorFilter()),
    }),
    new winston.transports.File({
        level: "warn",
        filename: "logs/warn.log",
        format: winston.format.combine(warnFilter()),
    }),
    new winston.transports.File({
        level: "info",
        filename: "logs/info.log",
        format: winston.format.combine(infoFilter()),
    }),
    new winston.transports.File({
        level: "http",
        filename: "logs/http.log",
        format: winston.format.combine(httpFilter()),
    }),
    new winston.transports.File({
        level: "debug",
        filename: "logs/debug.log",
        format: winston.format.combine(debugFilter()),
    }),
];

const logger = winston.createLogger({
    level,
    levels,
    format,
    transports,
});

const extractReqOriginData = (req) => {
    return {
        userId: req.user ? req.user._id : undefined,
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    };
};

module.exports = { logger, extractReqOriginData };
