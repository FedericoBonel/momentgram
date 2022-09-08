const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, "Please provide an image url"],
    },
    byteSize: {
        type: Number,
        required: [true, "Please provide an image size in bytes"],
    },
    height: {
        type: Number,
        required: [true, "Please provide an image height"],
    },
    width: {
        type: Number,
        required: [true, "Please provide an image width"],
    },
});

const momentSchema = new mongoose.Schema(
    {
        location: {
            type: String,
            minlength: 4,
            maxlength: 50,
            required: [true, "Please provide a location"],
        },
        description: {
            type: String,
            maxlength: 256,
            required: [true, "Please provide a description"],
        },
        img: imageSchema,
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const momentModel = mongoose.model("Moment", momentSchema)

module.exports = momentModel;