import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from './errors.js';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
interface JwtPayload {
    userId: string;
}


export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Authorization token missing");
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new UnauthorizedError('Authentication token is missing');
    }
    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        throw new UnauthorizedError("Invalid or expired access token");
    }
}