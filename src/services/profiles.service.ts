import { profileRepository } from '../repositories/profiles.repositories.js';
import { Profile, ProfileWithUser, UpdateProfileDTO } from '../types/profile.types.js';
import { NotFoundError } from '../middlewares/errors.js';

export class ProfileService {
    async getProfileByUsername(username: string): Promise<ProfileWithUser> {
        const profile = await profileRepository.findByUsername(username);
        if (!profile) {
            throw new NotFoundError(`Profile for user "${username}" not found.`);
        }
        return profile;
    }

    async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<Profile> {
        const existingProfile = await profileRepository.findByUserId(userId);
        if (!existingProfile) {
            throw new NotFoundError('Profile not found.');
        }

        const updatedProfile = await profileRepository.update(userId, dto);
        if (!updatedProfile) {
            throw new NotFoundError('Failed to update profile.');
        }

        return updatedProfile;
    }
}

export const profileService = new ProfileService();
