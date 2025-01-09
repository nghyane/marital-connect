import { api, APIError } from "encore.dev/api";
import { authService } from "../services/auth.service";
import { RegisterRequest, RegisterResponse } from "../interfaces/register.interface";
import { generateToken } from "../../../shared/utils";
import { userService } from "../../users/services/user.service";

export const register = api<RegisterRequest, RegisterResponse>(
    {
        expose: true,
        auth: false,
        method: "POST",
        path: "/register",
    },
    async ({ email, password, name }) => {
        const user = await authService.register({ email, password, name });

        if (!user) {
            throw APIError.canceled("User registration failed");
        }

        await userService.assignRole(user.id, 1);

        return {
            token: generateToken(user.id),
            expiresIn: 7 * 24 * 60 * 60 * 1000,
        };
    }
);