import { api, APIError } from "encore.dev/api";
import { authService } from "../services/auth.service";
import { LoginRequest, LoginResponse } from "../interfaces/login.interface";
import { generateToken, generateRefreshToken } from "../utils";
import { EXPIRES_IN } from "../../../shared/constants";
import { apiResponse } from "../../../shared/api-response";
import { logger } from "../../../shared/logger";

export const login = api<LoginRequest, LoginResponse>(
    {
        expose: true,
        auth: false,
        method: "POST",
        path: "/login",
    },
    async (req) => {
        const { email, password } = req;
        
        logger.info("Login attempt", { email });

        try {
            const user = await authService.login(email, password);

            if (!user) {
                logger.warn("Failed login attempt", { email });
                throw APIError.unauthenticated("Invalid email or password");
            }

            logger.info("Successful login", { userId: user.id });
            
            return apiResponse.success({
                accessToken: generateToken(user.id),
                refreshToken: generateRefreshToken(user.id),
                expiresIn: EXPIRES_IN,
            }, "Login successful");
        } catch (error) {
            logger.error(error, "Login error", { email });
            throw error;
        }
    }
);