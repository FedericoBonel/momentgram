const { NotFoundError } = require("../../errors");
const { momentExists } = require("../../services/MomentService");

const checkMomentExists = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { id: momentId } = req.params;

    if (!(await momentExists(userId, momentId))) {
        throw new NotFoundError(`Moment with id ${momentId} not found`);
    }

    next();
};

module.exports = checkMomentExists;
