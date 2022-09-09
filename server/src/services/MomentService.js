const {
    getNumberMomentsBy,
    getMomentBy,
} = require("../repositories/MomentRepository");
const { getNumberCommentsOf } = require("../services/MomentCommentService");
const { getNumberLikesOf } = require("../services/MomentLikeService");

const getMomentsOf = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const moments = await getMomentBy({ createdBy: userId }, skip, limit);

    for (const moment of moments) {
        const numberComments = await getNumberCommentsOf(moment._id);
        const numberLikes = await getNumberLikesOf(moment._id);
        moment = {
            ...moment,
            numberComments: numberComments,
            numberLikes: numberLikes,
        };
    }

    return moments;
};

const getNumberMomentsOf = async (userId) => {
    return await getNumberMomentsBy({ createdBy: userId });
};

module.exports = { getNumberMomentsOf, getMomentsOf };
