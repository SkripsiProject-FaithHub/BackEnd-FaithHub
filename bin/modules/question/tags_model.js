const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
    religion: {
        type: String,
        required: true
    },
    tags: {
        type: Array, // Ensure tags are defined as an array of strings
        default: [],
    },
});

const tags = mongoose.model("tag", tagsSchema);
module.exports = tags;