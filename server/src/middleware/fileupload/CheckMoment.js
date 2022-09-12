const { NotFoundError } = require("../../errors");
const { getMomentByUser } = require("../../services/MomentService");

const checkMomentExists = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { id: momentId } = req.params;

    await getMomentByUser(userId, momentId);

    next();
};

module.exports = checkMomentExists;
