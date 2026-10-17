import { Request, Response, NextFunction } from "express";
import { socialService } from "../services/social.service.js";

export class SocialController {
    async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const postId = req.params.id as string;
            const result = await socialService.toggleLike(postId, req.userId!);
            res.status(200).json({
                success: true,
                message: result.liked ? "Post liked" : "Post unliked",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const postId = req.params.id as string;
            const { content } = req.body;
            const comment = await socialService.addComment(postId, req.userId!, content);
            res.status(201).json({
                success: true,
                message: "Comment added successfully",
                data: { comment },
            });
        } catch (error) {
            next(error);
        }
    }

    async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const postId = req.params.id as string;
            const comments = await socialService.getComments(postId);
            res.status(200).json({
                success: true,
                data: { comments },
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const commentId = req.params.id as string;
            await socialService.deleteComment(commentId, req.userId!);
            res.status(200).json({
                success: true,
                message: "Comment deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
    async toggleFollow(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const targetUserId = req.params.id as string;
            const result = await socialService.toggleFollow(req.userId!, targetUserId);
            res.status(200).json({
                success: true,
                message: result.following ? "User followed" : "User unfollowed",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

}

export const socialController = new SocialController();
