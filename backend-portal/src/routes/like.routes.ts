import { Router } from 'express';
import * as LikeController from '../controllers/like.controller';

const router = Router();

router.post('/answers/:answerId/like', LikeController.likeAnswer);
router.post('/answers/:answerId/dislike', LikeController.dislikeAnswer);

export default router; 