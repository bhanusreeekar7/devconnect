import { Router } from "express";
import { postController } from "../controllers/posts.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createPostSchema } from "../schemas/posts.schema.js";
import { socialController } from "../controllers/social.controller.js";
import { createCommentSchema } from "../schemas/social.schemas.js";

export const postsRouter = Router();

postsRouter.get('/', (req, res, next) => postController.getFeed(req, res, next));

postsRouter.get('/:id', (req, res, next) => postController.getById(req, res, next));

postsRouter.post(
    '/',
    authenticate,
    validate(createPostSchema),
    (req, res, next) => postController.create(req, res, next)
);

postsRouter.delete(
    '/:id',
    authenticate,
    (req, res, next) => postController.delete(req, res, next)
);
postsRouter.post('/:id/like', authenticate, (req, res, next) => socialController.toggleLike(req, res, next));
postsRouter.post('/:id/comments', authenticate, validate(createCommentSchema), (req, res, next) => socialController.addComment(req, res, next));
postsRouter.get('/:id/comments', (req, res, next) => socialController.getComments(req, res, next));
