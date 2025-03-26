import { api, APIError } from "encore.dev/api";
import { authService } from "../services/auth.service";
import { RegisterRequest, RegisterResponse } from "../interfaces/register.interface";
import { generateRefreshToken, generateToken } from "../utils";
// import { userService } from "../../users/services/user.service";
import { EXPIRES_IN } from "../../../shared/constants";
import { apiResponse } from "../../../shared/api-response";
import { logger } from "../../../shared/logger";

export const register = api<RegisterRequest, RegisterResponse>(
    {
        expose: true,
        auth: false,
        method: "POST",
        path: "/register",
    },
    async ({ email, password, name, passwordConfirmation, accountType }) => {
        logger.info("Registration attempt", { email, accountType });

        try {
            if (password !== passwordConfirmation) {
                logger.warn("Password mismatch during registration", { email });
                throw APIError.invalidArgument("Password and password confirmation do not match");
            }

            const roleId = accountType === 'expert' ? 3 : 1;
            
            const user = await authService.register({ email, password, name, roleId });

            if (!user) {
                logger.error(new Error("Registration failed"), "Database error", { email });
                throw APIError.internal("User registration failed");
            }

            logger.info("User registered successfully", { userId: user.id, accountType });
            
            return apiResponse.success({
                accessToken: generateToken(user.id),
                refreshToken: generateRefreshToken(user.id),
                expiresIn: EXPIRES_IN,
            }, "User registered successfully");
            
        } catch (error) {
            if (error instanceof Error && error.message.includes('users_email_unique')) {
                logger.warn("Registration failed - email exists", { email });
                throw APIError.alreadyExists("Email already exists");
            }

            logger.error(error, "Registration error", { email });
            throw error;
        }
    }
);