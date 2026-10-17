import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res, next));
authRouter.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));
authRouter.post('/logout', (req, res, next) => authController.logout(req, res, next));

authRouter.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
authRouter.get('/me', authenticate, (req, res, next) => authController.getMe(req, res, next));