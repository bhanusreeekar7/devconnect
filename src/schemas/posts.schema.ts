import { z } from 'zod';

export const createPostSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title cannot exceed 150 characters'),
    content: z
        .string()
        .min(5, 'Content must be at least 5 characters')
        .max(10000, 'Content cannot exceed 10,000 characters'),
    code_snippet: z
        .string()
        .max(5000, 'Code snippet cannot exceed 5000 characters')
        .optional(),
    code_language: z
        .string()
        .max(30, 'Language name cannot exceed 30 characters')
        .optional(),
    tags: z
        .array(
            z.string().trim().min(1, 'Tag cannot be empty').max(25, 'Tag cannot exceed 25 characters')
        )
        .max(5, 'A post can have at most 5 tags')
        .optional(),
});
