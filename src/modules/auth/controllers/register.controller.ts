import { api, APIError } from "encore.dev/api";
import { authService } from "../services/auth.service";
import { RegisterRequest, RegisterResponse } from "../interfaces/register.interface";
import { generateRefreshToken, generateToken } from "../../../shared/utils";
// import { userService } from "../../users/services/user.service";
import { EXPIRES_IN } from "../../../shared/constants";
export const register = api<RegisterRequest, RegisterResponse>(
    {
        expose: true,
        auth: false,
        method: "POST",
        path: "/register",
    },
    async ({ email, password, name, passwordConfirmation, accountType }) => {
        if (password !== passwordConfirmation) {
            throw APIError.canceled("Password and password confirmation do not match");
        }

        const roleId = accountType === 'expert' ? 3 : 1;

        try {
            const user = await authService.register({ email, password, name, roleId });
            if (!user) {
                throw APIError.canceled("User registration failed");
            }

            return {
                data: {
                    accessToken: generateToken(user.id),
                    refreshToken: generateRefreshToken(user.id),
                    expiresIn: EXPIRES_IN,
                },
                message: "User registered successfully",
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('users_email_unique')) {
                throw APIError.canceled("Email already exists");
            }

            throw APIError.canceled("User registration failed");
        }
    }
);