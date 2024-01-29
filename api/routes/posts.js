const express = require('express');

const PostsController = require('../controllers/posts');
const checkAuth = require('../auth/check-auth');
const router = express.Router();

// get routes dont need auth
router.get('/', PostsController.getAllPosts);
router.get('/:postId', PostsController.getPostById);
router.get('/user/:userId', PostsController.getPostsByUser);

router.post('/', checkAuth, PostsController.createPost);

router.patch('/:postId', checkAuth, PostsController.updatePost);

router.delete('/:postId', checkAuth, PostsController.deletePost);

module.exports = router;
