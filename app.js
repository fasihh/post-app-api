const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// routes
const userRoute = require('./api/routes/user');
const postsRoute = require('./api/routes/posts');
const commentsRoute = require('./api/routes/comments');

// db connector
mongoose.connect(
    `mongodb+srv://fasihh:${process.env.MONGO_ATLAS_PW}@practice-shop-node.tn87mzk.mongodb.net/post-app?retryWrites=true&w=majority`
);

// logging
app.use(morgan('dev'));

// body and url parsers
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// implement cors
app.use(cors());

// using routes
app.use('/user', userRoute);

app.use('/posts', postsRoute);
app.use('/posts', commentsRoute);

module.exports = app;
