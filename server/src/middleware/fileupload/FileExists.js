const { BadRequestError } = require("../../errors");

const checkFileExists = async (req, res, next) => {
    if (!req.files) {
        throw new BadRequestError("Please provide a valid file");
    }
    next();
};

module.exports = checkFileExists;