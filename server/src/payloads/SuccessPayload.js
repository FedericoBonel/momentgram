const ApiPayload = require("./ApiPayload");

class SuccessPayload extends ApiPayload {
    constructor(data) {
        super(true);
        this.data = data;
    }
}

module.exports = SuccessPayload;