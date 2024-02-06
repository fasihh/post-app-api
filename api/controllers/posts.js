const mongoose = require('mongoose');

const handleError = require('../utils/err');
const Post = require('../models/post');

module.exports.createPost = (req, res, next) => {
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        creatorId: req.userData.userId,
        title: req.body.title,
        content: req.body.content || "",
        comments: []
    });

    post.save()
    .then(result => {
        res.status(201).json({
            message: 'Post created',
            post: {
                postId: post._id,
                creator: post.creator,
                title: post.title,
            },
            request: {
                type: 'GET',
                url: `http://localhost:${process.env.PORT}/posts/${post._id}`
            }
        });
    })
    .catch(err => handleError(err, res));
}

module.exports.getAllPosts = (req, res, next) => {
    Post.find()
    .populate('creatorId')
    .exec()
    .then(posts => {
        return res.status(200).json({
            count: posts.length,
            posts: posts.map(post => {
                return {
                    _id: post._id,
                    creator: post.creatorId.email,
                    title: post.title,
                    likes: post.likes,
                    timestamps: {
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt
                    },
                    request: {
                        type: 'GET',
                        url: `http://localhost:${process.env.PORT}/posts/${post._id}`
                    }
                }
            })
        });
    })
    .catch(err => handleError(err, res));
}

// TODO: populate comments
module.exports.getPostById = (req, res, next) => {
    Post.findById(req.params.postId)
    .populate('creatorId', '_id email')
    .exec()
    .then(post => {
        res.status(200).json({
            _id: post._id,
            creator: post.creatorId.email,
            timestamps: {
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            },
            title: post.title,
            content: post.content,
            likes: post.likes,
            request: {
                type: 'GET',
                url: `http://localhost:${process.env.PORT}/posts`
            }
        });
    })
    .catch(err => handleError(err, res));
}

module.exports.getPostsByUser = (req, res, next) => {
    const id = req.params.userId;

    Post.find({creatorId: id})
    .exec()
    .then(posts => {
        res.status(200).json({
            count: posts.length,
            posts: posts.map(post => {
                return {
                    _id:  post._id,
                    timestamps: {
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt
                    },
                    title: post.title,
                    content: post.content,
                    likes: post.likes,
                    comments: post.comments,
                    request: {
                        type: 'GET',
                        url: `http://localhost:${process.env.PORT}/posts/${post._id}`
                    }
                }
            })
        });
    })
    .catch(err => handleError(err, res));
}

module.exports.updatePost = (req, res, next) => {
    const id = req.params.postId;

    Post.findById(id)
    .exec()
    .then(post => {
        if (!post) return res.status(404).json({message: 'Post does not exist'});
        if (post.creatorId != req.userData.userId) return res.status(403).json({ message: 'Permission denied' });

        const updateOps = {};
        for (const ops in req.body) updateOps[ops] = req.body[ops];
    
        Post.updateOne({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Post updated',
                request: {
                    type: 'GET',
                    url: `http://localhost:${process.env.PORT}/posts/${id}`
                }
            })
        })
        .catch(err => handleError(err, res));
    })
    .catch(err => handleError(err, res));
}

module.exports.deletePost = (req, res, next) => {
    const id = req.params.postId;

    Post.findById(id)
    .exec()
    .then(post => {
        if (!post) return res.status(404).json({ message: 'Post does not exist or has already been deleted' }); 

        if (post.creatorId != req.userData.userId) return res.status(403).json({ message: 'Permission denied' });

        Post.deleteOne({_id: id})
        .exec()
        .then(result => {
            return res.status(200).json({
                message: `Post created by ${req.userData.email} has been deleted`,
                request: {
                    type: 'POST',
                    url: `http://localhost:${process.env.PORT}/posts`,
                    body: {
                        title: {type: 'String', fieldRequired: true},
                        content: {type: 'String', fieldRequired: false}
                    }
                }
            });
        })
        .catch(err => handleError(err, res));
    })
    .catch(err => handleError(err, res));
}