const morgan = require("morgan");

const logger = require("../services/LoggerService");

// Tell morgan to use winston
const httpLogger = morgan(
    ":remote-addr :url :method :status :res[content-length] :response-time ms",
    {
        stream: { write: (message) => logger.http(message) },
    }
);

module.exports = httpLogger;
