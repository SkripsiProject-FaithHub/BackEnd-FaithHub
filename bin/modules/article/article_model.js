const mongoose = require("mongoose");
const validator = require("validator");

const articleSchema = new mongoose.Schema({
    articleId: {
        type: String,
        required: true,
    },
    articleTitle: {
        type: String,
        required: [true, "A post must have a title"],
        trim: true,
    },

    description: {
        type: String,
        required: [true, "A post must have a description"],
        trim: true,
    },

    creatorId: {
        type: String,
        required: [true, "A post must have a creator"],
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    media: {
        type: String,
        // required: [true, "A file is must required to create a post!"],
        trim: true,
    },

    tags: {
        type: Array,
        default: [],
    },
    
    religion: {
        type: String
      }
    ,

    upVotes: {
        type: Array,
        default: [],
    },

    downVotes: {
        type: Array,
        default: [],
    },

    comments: {
        type: Array,
        default: [],
    },
});

const Post = mongoose.model("Article", articleSchema);
module.exports = Post;