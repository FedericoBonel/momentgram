const RequestTooLongError = require("../../errors/RequestTooLongError");

const MB_MAX_SIZE = process.env.MAX_IMG_SIZE; // 5 MB limit
const MAX_SIZE = MB_MAX_SIZE * 1024 * 1024;

const checkFileSize = async (req, res, next) => {
    const files = req.files;

    let invalidFiles = [];
    Object.keys(files).forEach((file) => {
        if (files[file].size > MAX_SIZE) {
            invalidFiles.push(file);
        }
    });

    if (invalidFiles.length) {
        throw new RequestTooLongError(
            `The following files have a greater size than the allowed 
            ${MB_MAX_SIZE} MB: ${invalidFiles}`
        );
    }

    next();
};

module.exports = checkFileSize;