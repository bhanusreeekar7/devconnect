import { Router } from "express";
import { profileController } from "../controllers/profiles.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../schemas/profile.schemas.js";

export const profilesRouter = Router();

profilesRouter.patch(
    '/me',
    authenticate,
    validate(updateProfileSchema),
    (req, res, next) => profileController.updateMe(req, res, next)
);

profilesRouter.get(
    '/:username',
    (req, res, next) => profileController.getByUsername(req, res, next)
);
