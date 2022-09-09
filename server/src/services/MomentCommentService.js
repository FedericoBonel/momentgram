const {
    getNumberCommentsBy,
} = require("../repositories/MomentCommentRepository");

const getNumberCommentsOf = async (momentId) => {
    return await getNumberCommentsBy({ moment: momentId });
};

module.exports = { getNumberCommentsOf };
