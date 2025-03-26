import { Request, Response, NextFunction } from 'express';

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // If not authenticated, return 401 Unauthorized
  res.status(401).json({ message: 'Unauthorized' });
};

// Middleware to ensure user is NOT authenticated (for login/register pages)
export const isNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  
  // If already authenticated, redirect to dashboard
  res.status(400).json({ message: 'Already authenticated' });
};