import { Request, Response, NextFunction } from "express";
import { profileService } from "../services/profiles.service.js";
export class ProfileController {
    async getByUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const username = req.params.username as string;
            const profile = await profileService.getProfileByUsername(username);
            res.status(200).json({
                success: true,
                data: { profile },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // req.userId was set by the authenticate middleware
            const profile = await profileService.updateProfile(req.userId!, req.body);
            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: { profile },
            });
        } catch (error) {
            next(error);
        }
    }
}
export const profileController = new ProfileController();
