const { StatusCodes } = require("http-status-codes");
const ApiError = require("./ApiError");

class ServerError extends ApiError {
    constructor(message) {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = ServerError;
