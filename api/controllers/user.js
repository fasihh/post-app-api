const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const handleError = require('../utils/err');
const authFailed = require('../utils/auth-failed');

// user signup
module.exports.createUser = (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        // user already exists
        if (user) return res.staus(422).json({message: 'User with this email already exists'}); 

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) return handleError(err, res); // hash err

            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
        
            newUser.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created successfully'
                });
            })
            .catch(err => handleError(err, res)); // db err
        })
    })
    .catch(err => handleError(err, res)); // db err
}

// user login
module.exports.loginUser = (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if (!user) return authFailed(res); // user doesn't exist

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (!result) return authFailed(res); // incorrect password

            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email
                },
                `${process.env.JWT_KEY}`,
                {
                    expiresIn: '4h'
                }
            );

            res.status(200).json({
                message: 'Login successful',
                token: `Bearer ${token}`
            });
        });
    })
    .catch(err => handleError(err, res));
}