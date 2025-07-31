import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const router = Router();

router.post('/', UserController.createUser); // Super Admin only
router.get('/list', UserController.getUsersList); // List all users
router.get('/:id', UserController.getUserById); // Get user details by ID
router.put('/:id', UserController.updateUser); // Update user by ID
router.delete('/:id', UserController.deleteUser); // Delete user by ID

export default router;
