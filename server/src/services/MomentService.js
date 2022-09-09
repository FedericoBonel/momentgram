const { getNumberMomentsBy, getMomentBy } = require("../repositories/MomentRepository");

const getMomentsOf = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    return await getMomentBy({createdBy: userId}, skip, limit);
}

const getNumberMomentsOf = async (userId) => {
    return await getNumberMomentsBy({ createdBy: userId });
};

module.exports = {getNumberMomentsOf, getMomentsOf};
