const fs = require("fs");

const { InternalServerError } = require("../errors");

const deleteFiles = (paths) => {
    try {
        return Promise.all(paths.map((path) => deleteFile(path)));
    } catch (error) {
        throw new InternalServerError(`Error while deleting files: ${paths}`);
    }
};

const deleteFile = (path) => {
    return new Promise((res, rej) => {
        try {
            fs.unlink(path, (err) => {
                if (err) {
                    rej(Error());
                }
                res();
            });
        } catch (err) {
            throw new InternalServerError(
                `There was an error while deleting the following file: ${path}`
            );
        }
    });
};

module.exports = { deleteFiles, deleteFile };
