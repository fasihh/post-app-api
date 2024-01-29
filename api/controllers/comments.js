const mongoose = require('mongoose');

const handleError = require('../utils/err');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.getAllComments = (req, res, next) => {
    Post.findById(req.params.postId)
    .populate('comments')
    .exec()
    .then(post => {
        res.status(200).json({
            count: post.comments.length,
            comments: post.comments.map(comment => {
                comment['postId'] = undefined;
                return comment;
            })
        });
    })
    .catch(err => handleError(err, res));
}

// TODO: populate replies
module.exports.getCommentById = (req, res, next) => {
    Post.findById(req.params.postId)
    .exec()
    .then(post => {
        if (!post) return res.status(404).json({ message: 'Post does not exist'} );

        Comment.findById(req.params.commentId)
        .populate('creatorId', '_id email')
        .populate('postId', '_id creatorId title content likes')
        .exec()
        .then(comment => {
            if (!comment) return res.status(404).json({ message: 'Comment does not exist' });

            res.status(200).json({
                _id: comment._id,
                creator: {
                    id: comment.creatorId._id,
                    email: comment.creatorId.email
                },
                post: {
                    id: comment.postId._id,
                    creator: comment.postId.creatorId,
                    title: comment.postId.title,
                    content: comment.postId.content
                },
                content: comment.content,
                likes: comment.likes,
                timestamps: {
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt
                },
                replies: comment.replies,
                request: {
                    type: 'GET',
                    description: 'Get all comments under this post',
                    url: `http://localhost:${process.env.PORT}/posts/${req.params.postId}/comments`
                }
            });
        })
        .catch(err => handleError(err, res));
    })
    .catch(err => handleError(err, res));
}

module.exports.createComment = (req, res, next) => {
    const id = req.params.postId;

    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        postId: req.params.postId,
        creatorId: req.userData.userId,
        content: req.body.content,
        replies: []
    });

    Post.updateOne({_id: id}, {$push: {comments: comment._id}})
    .exec()
    .then(postResult => {
        comment.save()
        .then(commentResult => {
            res.status(200).json({
                message: 'Comment successfully added',
                request: {
                    type: 'GET',
                    url: `http://localhost:${process.env.PORT}/posts/${id}/comments/${comment._id}`
                }
            });
        })
        .catch(err => handleError(err, res));
    })
    .catch(err => handleError(err, res));
}

module.exports.updateComment = (req, res, next) => {
    const id = req.params.commentId;

    Comment.findById(id)
    .exec()
    .then(comment => {
        if (!comment) return res.status(404).json({message: 'Comment does not exist'});
        if (comment.creatorId != req.userData.userId) return res.status(403).json({ message: 'Permission denied' });

        const updateOps = {};
        for (const ops in req.body) updateOps[ops] = req.body[ops];
    
        Comment.updateOne({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Comment updated',
                request: {
                    type: 'GET',
                    url: `http://localhost:${process.env.PORT}/posts/${req.params.postId}/comments/${id}`
                }
            })
        })
        .catch(err => handleError(err, res));
    })
    .catch(err => handleError(err, res));
}

module.exports.deleteComment = (req, res, next) => {
    const id = req.params.commentId;

    Comment.findById(id)
    .exec()
    .then(comment => {
        if (!comment) return res.status(404).json({message: 'Comment does not exist or has already been deleted'});
        if (comment.creatorId != req.userData.userId) return res.status(403).json({ message: 'Permission denied' });
    
        Comment.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Comment deleted',
                request: {
                    type: 'POST',
                    description: 'To create more comments under this post',
                    url: `http://localhost:${process.env.PORT}/posts/${req.params.postId}/comments/`
                }
            })
        })
        .catch(err => handleError(err, res));
    })
    .catch(err => handleError(err, res));
}