const path = require("path");

const UnprocessableEntityError = require("../../errors/UnprocessableEntityError");

const checkFileExtensions = (validExtensions) => {
    return async (req, res, next) => {
        const files = req.files;

        let invalidFiles = [];
        for (const file of Object.keys(files)) {
            const currExtension = path.extname(files[file].name);

            if (!validExtensions.includes(currExtension.toLowerCase())) {
                invalidFiles.push(files[file].name);
            }
        }

        if (invalidFiles.length) {
            throw new UnprocessableEntityError(
                `The following file/s have invalid extensions: ${invalidFiles.join(
                    ", "
                )}`
            );
        }

        next();
    };
};

module.exports = checkFileExtensions;
