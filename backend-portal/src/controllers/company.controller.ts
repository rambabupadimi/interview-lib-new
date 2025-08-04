import { Request, Response, NextFunction } from 'express';
import { CompanyRepository } from '../repositories/company.repository';

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('called');
    const user = (req as any).user;
    console.log(`User from request: ${JSON.stringify(user)}`);
    const created_by = user.userId;
    const { name } = req.body;


    const company = await CompanyRepository.createCompany({name,created_by});
    console.log(`Company created: ${JSON.stringify(company)}`);
    res.status(201).json(company);
  } catch (err) {
    console.log("----error----",err);
    next(err);
  }
};

export const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await CompanyRepository.updateCompany(+req.params.id, req.body);
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

export const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CompanyRepository.deleteCompany(+req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getCompanyList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await CompanyRepository.getAllCompanies();
    res.status(200).json(companies);
  } catch (err) {
    next(err);
  }
};