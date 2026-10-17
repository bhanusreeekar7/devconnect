import { Router } from "express";
import { socialController } from "../controllers/social.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const commentsRouter = Router();

commentsRouter.delete(
    '/:id',
    authenticate,
    (req, res, next) => socialController.deleteComment(req, res, next)
);
