import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const router = Router();

router.post('/', UserController.createUser); // Super Admin only

export default router; 