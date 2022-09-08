const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const ApiError = require("./ApiError");

class BadRequestError extends ApiError {
    constructor(message = ReasonPhrases.BAD_REQUEST) {
        super(message);
        this.status = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequestError;