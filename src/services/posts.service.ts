import { postRepository } from '../repositories/posts.repositories.js';
import { Post, PostWithAuthor, CreatePostDTO } from '../types/posts.types.js';
import { NotFoundError, ForbiddenError } from '../middlewares/errors.js';

export class PostService {
    async createPost(userId: string, dto: CreatePostDTO): Promise<Post> {
        return postRepository.create(userId, dto);
    }

    async getFeed(page?: number, limit?: number, tag?: string): Promise<PostWithAuthor[]> {
        const safePage = page && page > 0 ? page : 1;
        const safeLimit = limit && limit > 0 && limit <= 50 ? limit : 10;
        return postRepository.findFeed(safePage, safeLimit, tag);
    }

    async getPostById(id: string): Promise<PostWithAuthor> {
        const post = await postRepository.findById(id);
        if (!post) {
            throw new NotFoundError('Post not found.');
        }
        return post;
    }

    async deletePost(postId: string, userId: string): Promise<void> {
        const post = await postRepository.findById(postId);
        if (!post) {
            throw new NotFoundError('Post not found.');
        }

        if (post.user_id !== userId) {
            throw new ForbiddenError('You are not authorized to delete this post.');
        }

        await postRepository.delete(postId);
    }
}

export const postService = new PostService();
