import { Router } from 'express';
import * as CompanyController from '../controllers/company.controller';

const router = Router();

router.post('/', CompanyController.createCompany);
router.put('/:id', CompanyController.updateCompany);
router.delete('/:id', CompanyController.deleteCompany);

export default router; 