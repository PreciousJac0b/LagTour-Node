import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

interface IUser {
  _id: string;
  role: string;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}


const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(401);
    throw new Error('Access denied. No token provided.');
  }

  try {
    interface DecodedToken {
      id: string;
      role: string;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    if (!decoded.id) {
      res.status(400);
      throw new Error('Invalid token: No user ID found.');
    }
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user as IUser;
    next();
  } catch (err) {
    res.status(400);
    throw new Error('Invalid token');
  }
};

const authorizedRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied. You don't have the permission to access this resource."
      });
    }
    next();
  }
}

export { protect, authorizedRoles };