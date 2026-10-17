import { socialRepository } from '../repositories/social.repositories.js';
import { postRepository } from '../repositories/posts.repositories.js';
import { userRepository } from '../repositories/users.repositories.js';
import { LikeToggleResult, Comment, CommentWithAuthor, FollowToggleResult } from '../types/social.types.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../middlewares/errors.js';

export class SocialService {
    async toggleLike(postId: string, userId: string): Promise<LikeToggleResult> {
        //  Ensure post exists
        const post = await postRepository.findById(postId);
        if (!post) {
            throw new NotFoundError('Post not found.');
        }

        // Check if already liked
        const existingLike = await socialRepository.findLike(postId, userId);
        let liked: boolean;

        if (existingLike) {
            await socialRepository.removeLike(postId, userId);
            liked = false;
        } else {
            await socialRepository.addLike(postId, userId);
            liked = true;
        }

        //  Return the fresh like count
        const likes_count = await socialRepository.countLikes(postId);
        return { liked, likes_count };
    }

    async addComment(postId: string, userId: string, content: string): Promise<Comment> {
        const post = await postRepository.findById(postId);
        if (!post) {
            throw new NotFoundError('Post not found.');
        }
        return socialRepository.createComment(postId, userId, content);
    }

    async getComments(postId: string): Promise<CommentWithAuthor[]> {
        const post = await postRepository.findById(postId);
        if (!post) {
            throw new NotFoundError('Post not found.');
        }
        return socialRepository.findCommentsByPostId(postId);
    }

    async deleteComment(commentId: string, userId: string): Promise<void> {
        const comment = await socialRepository.findCommentById(commentId);
        if (!comment) {
            throw new NotFoundError('Comment not found.');
        }

        // Security check: Only the person who wrote the comment can delete it
        if (comment.user_id !== userId) {
            throw new ForbiddenError('You are not authorized to delete this comment.');
        }

        await socialRepository.deleteComment(commentId);
    }
    //  Follow / Unfollow a developer
    async toggleFollow(followerId: string, followingId: string): Promise<FollowToggleResult> {
        //  You cannot follow yourself!
        if (followerId === followingId) {
            throw new BadRequestError('You cannot follow yourself.');
        }

        // Ensure the user you are following exists
        const targetUser = await userRepository.findById(followingId);
        if (!targetUser) {
            throw new NotFoundError('User not found.');
        }

        // Toggle follow status
        const alreadyFollowing = await socialRepository.isFollowing(followerId, followingId);
        let following: boolean;

        if (alreadyFollowing) {
            await socialRepository.unfollow(followerId, followingId);
            following = false;
        } else {
            await socialRepository.follow(followerId, followingId);
            following = true;
        }

        return { following };
    }

}

export const socialService = new SocialService();
