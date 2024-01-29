const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    email: {
        type: String, 
        required: true,
        unique: true,
        match: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    },
    password: {type: String, required: true}
}, {versionKey: false, timestamps: true});

module.exports = mongoose.model('User', userSchema);
