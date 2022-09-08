const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const ApiError = require("./ApiError");

class UnauthorizedError extends ApiError {
    constructor(message = ReasonPhrases.UNAUTHORIZED) {
        super(message);
        this.status = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthorizedError;
