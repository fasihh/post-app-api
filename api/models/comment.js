const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    postId: {type: mongoose.Schema.ObjectId, ref: 'Post', required: true},
    creatorId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    replies: [{type: mongoose.Schema.ObjectId, ref: 'Reply'}],
    likes: {type: Number, default: 0}
}, {versionKey: false, timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);
