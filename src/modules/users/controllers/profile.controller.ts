import { api, APIError } from "encore.dev/api";
import { ProfileRequest, ProfileResponse } from "../interfaces/profile.interface";
import { getAuthData } from "~encore/auth";
import { userService } from "../services/user.service";

export const profile = api<ProfileRequest, ProfileResponse>(
    {
        method: "GET",
        path: "/profile",
        auth: true,
        expose: true,
    },
    async () => {
        const userID = Number(getAuthData()!.userID);

        const user = await userService.getUser(userID);

        if (!user) {
            throw APIError.notFound("User not found");
        }
        
        return user;
    }
);

