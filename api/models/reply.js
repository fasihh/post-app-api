const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    creatorId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    target: {type: mongoose.Schema.ObjectId, ref: 'User'},
    content: {type: String, required: true},
    likes: {type: Number, default: 0}
}, {versionKey: false, timestamps: true});

module.exports = mongoose.model('Reply', replySchema);
