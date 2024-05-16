const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    replyId: {
        type: String,
        required: true
    },
    creatorId: {
        type: String,
        required: true,
    },
    reply: {
        type: String,
        required: [true, "Reply cannot be empty"],
    },
    replyToPost: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    upVotes: {
        type: Array,
        default: [],
    },

    downVotes: {
        type: Array,
        default: [],
    },
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;