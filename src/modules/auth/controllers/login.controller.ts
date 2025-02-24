import { api, APIError } from "encore.dev/api";
import { authService } from "../services/auth.service";

import { LoginRequest, LoginResponse } from "../interfaces/login.interface";
import { generateToken, comparePassword, generateRefreshToken } from "../../../shared/utils";
import { EXPIRES_IN } from "../../../shared/constants";

export const login = api<LoginRequest, LoginResponse>(
    {
        expose: true,
        auth: false,
        method: "POST",
        path: "/login",
    },
    async (req) => {
        const { email, password } = req;

        const user = await authService.login(email, password);

        if (!user || !comparePassword(password, user.password)) {
            throw APIError.unauthenticated("Your account is not correct");
        }

        return {
            data: {
                accessToken: generateToken(user.id),
                refreshToken: generateRefreshToken(user.id),
                expiresIn: EXPIRES_IN,
            },
            message: "Login successful",
        };
    }
);