import { Request, Response, NextFunction } from "express";
import { postService } from "../services/posts.service.js";

export class PostController {
    // 1. POST /api/posts (Protected)
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const post = await postService.createPost(req.userId!, req.body);
            res.status(201).json({
                success: true,
                message: "Post created successfully",
                data: { post },
            });
        } catch (error) {
            next(error);
        }
    }

    async getFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const tag = req.query.tag ? String(req.query.tag) : undefined;

            const posts = await postService.getFeed(page, limit, tag);
            res.status(200).json({
                success: true,
                data: { posts },
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const post = await postService.getPostById(id);
            res.status(200).json({
                success: true,
                data: { post },
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            await postService.deletePost(id, req.userId!);
            res.status(200).json({
                success: true,
                message: "Post deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

export const postController = new PostController();
