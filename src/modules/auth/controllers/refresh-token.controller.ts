import { api, APIError } from "encore.dev/api";
import { generateRefreshToken, generateToken, verifyToken } from "../../../shared/utils";
import { EXPIRES_IN } from "../../../shared/constants";
import { apiResponse } from "../../../shared/api-response";
import { logger } from "../../../shared/logger";

type RefreshTokenRequest = {
    refreshToken: string;
};

type RefreshTokenResponse = {
    data: {
        token: string;
        expiresIn: number;
        refreshToken: string;
    };
    message?: string;
    success: boolean;
};

export const refreshToken = api<RefreshTokenRequest, RefreshTokenResponse>(
    {
        expose: true,
        auth: false,
        method: "POST",
        path: "/refresh-token",
    },
    async ({ refreshToken }) => {
        logger.info("Token refresh attempt");

        try {
            const decoded = verifyToken(refreshToken);

            if (typeof decoded === "string" || !decoded) {
                logger.warn("Invalid refresh token");
                throw APIError.unauthenticated("Invalid refresh token");
            }

            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                logger.warn("Expired refresh token");
                throw APIError.unauthenticated("Refresh token expired");
            }

            const userId = Number(decoded.userId);
            logger.info("Token refreshed successfully", { userId });

            return apiResponse.success({
                token: generateToken(userId),
                expiresIn: EXPIRES_IN,
                refreshToken: generateRefreshToken(userId),
            }, "Token refreshed successfully");
        } catch (error) {
            logger.error(error, "Token refresh error");
            throw error;
        }
    }
);


