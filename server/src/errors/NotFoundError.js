const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const ApiError = require("./ApiError");

class NotFoundError extends ApiError {
    constructor(message = ReasonPhrases.NOT_FOUND) {
        super(message);
        this.status = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;
