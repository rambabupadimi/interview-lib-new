import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    const user = await UserService.signup(name, email, password, role);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: error.message
      });
    }
    
    if (error.message === 'Invalid role') {
      return res.status(400).json({
        success: false,
        error: 'Invalid role',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong during signup'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    const result = await UserService.login(email, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: error.message
      });
    }
    
    if (error.message === 'Account is deactivated') {
      return res.status(403).json({
        success: false,
        error: 'Account deactivated',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong during login'
    });
  }
};

export const forgotPassword = (req: Request, res: Response) => {
  // TODO: Implement forgot password logic
  res.json({ message: 'Forgot password endpoint' });
};

export const resetPassword = (req: Request, res: Response) => {
  // TODO: Implement reset password logic
  res.json({ message: 'Reset password endpoint' });
};

export const logout = (req: Request, res: Response) => {
  // TODO: Implement logout logic
  res.json({ message: 'Logout endpoint' });
}; 