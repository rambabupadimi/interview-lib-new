import { Router } from 'express';
import * as CompanyController from '../controllers/company.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);

router.post('/', CompanyController.createCompany);
router.put('/:id', CompanyController.updateCompany);
router.delete('/:id', CompanyController.deleteCompany);
router.get('/', CompanyController.getCompanyList);

export default router;