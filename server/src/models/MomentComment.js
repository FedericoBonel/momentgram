const mongoose = require("mongoose");

const momentCommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            minlength: 1,
            maxlength: 256,
            required: [true, "Please provide a comment"],
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        moment: {
            type: mongoose.Types.ObjectId,
            ref: "Moment",
        },
    },
    { timestamps: true }
);

const momentCommentModel = mongoose.model("Momentcomment", momentCommentSchema);

module.exports = momentCommentModel;
