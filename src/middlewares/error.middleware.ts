import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors.js";
import { env } from "../config/env.js";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err.code === '23505') {
        res.status(409).json({
            success: false,
            message: "A record with this value already exists",
        });
        return;
    }
    console.error('💥 UNEXPECTED ERROR:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(env.NODE_ENV === 'development' && { error: err.message, stack: err.stack }),
    });
}