const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const { ApiError } = require("../errors");
const { ErrorPayload } = require("../payloads");

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
    }

    res.status(customError.status).json(new ErrorPayload(customError.message));
};

module.exports = handleErrors;
