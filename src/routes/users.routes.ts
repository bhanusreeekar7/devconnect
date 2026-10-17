import { Router } from "express";
import { socialController } from "../controllers/social.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const usersRouter = Router();

usersRouter.post('/:id/follow', authenticate, (req, res, next) => socialController.toggleFollow(req, res, next));
