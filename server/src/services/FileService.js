const fs = require("fs");
const path = require("path");

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

const saveImage = async (imageFile, imageName) => {
    const dir = getDirToImagesFor(imageName);

    try {
        await imageFile.mv(dir);
    } catch (error) {
        throw new InternalServerError(
            "An error happened during file upload, please retry again"
        );
    }
};

const getDirToImagesFor = (name) => {
    return path.join(__dirname, "..", "..", "public", "images", name);
};

module.exports = { deleteFiles, deleteFile, getDirToImagesFor, saveImage };
