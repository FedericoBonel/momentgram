const { StatusCodes } = require("http-status-codes");

const ApiError = require("./ApiError");

class RequestTooLongError extends ApiError {
    constructor(message) {
        super(message, StatusCodes.REQUEST_TOO_LONG);
    }
}

module.exports = RequestTooLongError;
