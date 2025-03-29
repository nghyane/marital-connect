import { api, APIError } from "encore.dev/api";
import { ProfileRequest, ProfileResponse, UpdateProfileRequest, UpdateProfileResponse } from "../interfaces/profile.interface";
import { getAuthData } from "~encore/auth";
import { userService } from "../services/user.service";
import { apiResponse } from "../../../shared/api-response";
import { logger } from "../../../shared/logger";

export const profile = api<ProfileRequest, ProfileResponse>(
    {
        method: "GET",
        path: "/profile",
        auth: true,
        expose: true,
    },
    async () => {
        try {
            const userID = Number(getAuthData()!.userID);
            logger.info("Profile request", { userID });

            const user = await userService.getUser(userID);

            if (!user) {
                logger.warn("User not found for profile request", { userID });
                throw APIError.notFound("User not found");
            }
            
            logger.info("Profile retrieved successfully", { userID });
            
            return apiResponse.success(user, "Profile retrieved successfully");
        } catch (error) {
            logger.error(error, "Profile retrieval error");
            throw error;
        }
    }
);

export const updateProfile = api<UpdateProfileRequest, UpdateProfileResponse>(
    {
        method: "PUT",
        path: "/profile",
        auth: true,
        expose: true,
    },
    async (req) => {
        try {
            const userID = Number(getAuthData()!.userID);
            logger.info("Update profile request", { userID });

            const user = await userService.getUser(userID);

            if (!user) {
                logger.warn("User not found for profile update", { userID });
                throw APIError.notFound("User not found");
            }
            
            const updateData = {
                name: req.name,
                bio: req.bio,
                phone: req.phone,
                address: req.address,
                city: req.city,
                state: req.state,
                country: req.country,
                postal_code: req.postal_code
            };
            
            const updatedUser = await userService.updateUser(userID, updateData);
            
            logger.info("Profile updated successfully", { userID });
            
            return apiResponse.success(updatedUser, "Profile updated successfully");
        } catch (error) {
            logger.error(error, "Profile update error");
            throw error;
        }
    }
);

