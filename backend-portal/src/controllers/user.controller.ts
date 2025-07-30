import { Request, Response } from 'express';
 
export const createUser = (req: Request, res: Response) => {
  // TODO: Implement super admin create user logic
  res.json({ message: 'Create user endpoint (Super Admin only)' });
}; 