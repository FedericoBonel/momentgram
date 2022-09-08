const mongoose = require("mongoose");

const momentLikeSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        moment: {
            type: mongoose.Types.ObjectId,
            ref: "Moment",
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const momentLikeModel = mongoose.model("Momentlike", momentLikeSchema);

module.exports = momentLikeModel;
