import { api, APIError } from "encore.dev/api";
import { authService } from "../services/auth.service";
import { RegisterRequest, RegisterResponse } from "../interfaces/register.interface";
import { generateToken } from "../../../shared/utils";

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

        return {
            token: generateToken(user.id),
        };
    }
);