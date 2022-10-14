const { Error } = require("mongoose");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const { ApiError } = require("../errors");
const { ErrorPayload } = require("../payloads");
const logger = require("../services/LoggerService");

const handleErrors = async (err, req, res, next) => {
    const customError = new ApiError(
        err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
        err.status || StatusCodes.INTERNAL_SERVER_ERROR
    );

    if (err.code && err.code === 11000) {
        customError.message = `Duplicated value for ${Object.keys(
            err.keyValue
        )}, please provide another value/s`;
        customError.status = StatusCodes.BAD_REQUEST;
    } else if (err instanceof Error.CastError) {
        customError.message = `Entity with id: ${err.stringValue} not found.`;
        customError.status = StatusCodes.NOT_FOUND;
    }

    logger.error(`Error while handling request: '${customError.message || err.message}'`, {
        userId: `${req.user?.id}`,
        resStatus: `${customError.status}`,
        ip: `${req.headers["x-forwarded-for"] || req.socket.remoteAddress}`,
        stack: `${err.stack}`,
    });

    res.status(customError.status).json(new ErrorPayload(customError.message));
};

module.exports = handleErrors;
