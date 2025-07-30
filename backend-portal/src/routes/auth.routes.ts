import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { validateSignup } from '../validators/auth.validator';

const router = Router();

router.post('/signup', validateSignup, AuthController.signup);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/logout', AuthController.logout);

export default router; 