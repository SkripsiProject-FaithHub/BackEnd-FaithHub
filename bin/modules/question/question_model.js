const { UUID } = require("mongodb");
const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema({
    questionId: {
        type: String,
        default: "",
    },
    questionTitle: {
        type: String,
        required: [true, "Question cannot be empty"],
    },
    media: {
        type: Array,
        default: [],
    },
    description: {
        type: String,
        required: [true, "Description cannot be empty"],
    },
    tags: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    upVotes: {
        type: Array,
        default: [],
    },
    replyCount:{
        type: Number,
        default: 0,
    },
    downVotes: {
        type: Array,
        default: [],
    },
    creatorId: {
        type: String,
        // ref: "User"
        default: "",
    },
    views: {
        type: Number,
        default: 0,
    },
});

const Doubt = mongoose.model("Question", doubtSchema);
module.exports = Doubt;