import { Request, Response, NextFunction } from 'express';

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  // Check if all required fields are present
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Name, email, password, and role are required'
    });
  }

  // Validate name (at least 2 characters)
  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      error: 'Invalid name',
      message: 'Name must be at least 2 characters long'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format',
      message: 'Please provide a valid email address'
    });
  }

  // Validate password strength (minimum 6 characters)
  if (password.length < 6) {
    return res.status(400).json({
      error: 'Weak password',
      message: 'Password must be at least 6 characters long'
    });
  }

  // Validate role
  const validRoles = ['admin', 'superadmin', 'operator', 'user'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      error: 'Invalid role',
      message: 'Role must be one of: admin, superadmin, operator, user'
    });
  }

  next();
}; 