const fs = require("fs");
const path = require("path");

const { InternalServerError } = require("../errors");

/**
 * Deletes asynchronously a list of files given as a list of their directories
 * @param {[String]} paths Array of directories of the files to be deleted
 * @returns Promise for the deletion of elements
 */
const deleteFiles = (paths) => {
    try {
        return Promise.all(paths.map((path) => deleteFile(path)));
    } catch (error) {
        throw new InternalServerError(`Error while deleting files: ${paths}`);
    }
};

/**
 * Asynchronously Deletes a file in the given directory
 * @param {String} path Directory of the file to be deleted
 * @returns
 */
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

/**
 * Saves the given image to the public image folder under the given name
 * @param {UploadedFile} imageFile File to be saved
 * @param {String} imageName Name under which the file is to be saved
 */
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

/**
 * Gets the path to the public images folder under the given name
 * @param {String} name Name of the file to which the path will point to
 * @returns The public image directory for that file name
 */
const getDirToImagesFor = (name) => {
    return path.join(__dirname, "..", "..", "public", "images", name);
};

module.exports = { deleteFiles, deleteFile, getDirToImagesFor, saveImage };
