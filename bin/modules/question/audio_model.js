const { UUID } = require("mongodb");
const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema({
    audioId: {
        type: String,
        default: "",
    },
    audioTitle: {
        type: String,
        required: [true, "audioTitle cannot be empty"],
    },
    audio: {
        type: String
    },
    tags: {
        type: Array,
        default: [],
    },
    religion: {
        type: String
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now(),
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
    duration: {
        type: String,
    },
    url: {
        type: String
    },
});

const Audio = mongoose.model("Audio", audioSchema);
module.exports = Audio;