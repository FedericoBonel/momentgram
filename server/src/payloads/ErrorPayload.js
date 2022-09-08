const ApiPayload = require("./ApiPayload");

class ErrorPayload extends ApiPayload {
    constructor(error) {
        super(false);
        this.error = error;
    }
}

module.exports = ErrorPayload;