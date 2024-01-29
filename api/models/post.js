const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    creatorId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    content: {type: String},
    comments: [{type: mongoose.Schema.ObjectId, ref: 'Comment'}],
    likes: {type: Number, default: 0}
}, {versionKey: false, timestamps: true});

module.exports = mongoose.model('Post', postSchema);