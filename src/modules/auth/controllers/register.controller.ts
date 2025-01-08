import { api, APIError } from "encore.dev/api";
import { authService } from "../services/auth.service";
import { RegisterRequest, RegisterResponse } from "../interfaces/register.interface";

export const register = api<RegisterRequest, RegisterResponse>(
    {
        method: "POST",
        path: "/register",
    },
    async (req) => {
        const { email, password, name } = req;

        const user = await authService.register({ email, password, name });

        if (!user) {
            throw APIError.canceled("User registration failed");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
);