import { z } from 'zod';

export const updateProfileSchema = z.object({
    headline: z
        .string()
        .max(100, 'Headline cannot exceed 100 characters')
        .optional(),
    bio: z
        .string()
        .max(500, 'Bio cannot exceed 500 characters')
        .optional(),
    avatar_url: z
        .string()
        .url('Avatar must be a valid URL')
        .optional()
        .or(z.literal('')), // empty string if i clear my avatar
    github_url: z
        .string()
        .url('GitHub link must be a valid URL')
        .optional()
        .or(z.literal('')),
    skills: z
        .array(
            z.string().trim().min(1, 'Skill cannot be empty').max(30, 'Skill name too long')
        )
        .max(20, 'Cannot exceed 20 skills')
        .optional(),
});
