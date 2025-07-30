import { Router } from 'express';
import * as TechnologyController from '../controllers/technology.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Protect all technology routes
router.use(authenticateJWT);

// GET all technologies
router.get('/', TechnologyController.getAllTechnologies);

// GET technology by ID
router.get('/:id', TechnologyController.getTechnologyById);

// POST create new technology
router.post('/', TechnologyController.createTechnology);

// PUT update technology
router.put('/:id', TechnologyController.updateTechnology);

// DELETE technology
router.delete('/:id', TechnologyController.deleteTechnology);

export default router; 