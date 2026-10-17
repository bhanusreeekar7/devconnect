import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../middlewares/errors.js";

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user, tokens } = await authService.register(req.body);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
                success: true,
                message: "user registered successfully",
                data: {
                    user,
                    accessToken: tokens.accessToken,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user, tokens } = await authService.login(req.body);

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,

            });
            res.status(200).json({
                success: true,
                message: "Login Successful",
                data: {
                    user,
                    accessToken: tokens.accessToken,
                },

            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) { throw new UnauthorizedError("Refresh token is missing"); }
            const tokens = await authService.refresh(refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: {
                    accessToken: tokens.accessToken,
                },
            });

        }
        catch (error) {
            next(error);
        }
    }
    async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await authService.getMe(req.userId!);
            res.status(200).json({
                success: true,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();