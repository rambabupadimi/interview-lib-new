import { Router } from 'express';
import * as CommentController from '../controllers/comment.controller';

const router = Router();

router.post('/answers/:answerId/comments', CommentController.addComment);
router.put('/comments/:id', CommentController.updateComment);
router.delete('/comments/:id', CommentController.deleteComment);

export default router; 