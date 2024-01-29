const express = require('express');

const router = express.Router();
const CommentsController = require('../controllers/comments');
const checkAuth = require('../auth/check-auth');

router.get('/:postId/comments', CommentsController.getAllComments);
router.get('/:postId/comments/:commentId', CommentsController.getCommentById); //

router.post('/:postId/comments', checkAuth, CommentsController.createComment);

router.patch('/:postId/comments/:commentId', checkAuth, CommentsController.updateComment);

router.delete('/:postId/comments/:commentId', checkAuth, CommentsController.deleteComment);

module.exports = router;
