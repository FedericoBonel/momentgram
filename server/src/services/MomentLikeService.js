const {
    getNumberLikesBy,
} = require("../repositories/MomentLikeRepository");

const getNumberLikesOf = async (momentId) => {
    return await getNumberLikesBy({ moment: momentId });
};

module.exports = { getNumberLikesOf };