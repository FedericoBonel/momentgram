const { NotFoundError } = require("../errors");

const pathNotFound = async (req, res) => {
    throw new NotFoundError(`Path ${req.path} not found!`);
};

module.exports = pathNotFound;
