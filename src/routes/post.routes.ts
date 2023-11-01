import express from 'express';
import postsController = require('../controllers/posts.controller');

const router = express.Router();

router.get("/", postsController.posts_list);

export default router;