const { StatusCodes } = require("http-status-codes");

const ApiError = require("./ApiError");

class UnprocessableEntity extends ApiError {
    constructor(message) {
        super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

module.exports = UnprocessableEntity;
