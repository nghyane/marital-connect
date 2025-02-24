import { api, APIError } from "encore.dev/api";
import { generateRefreshToken, generateToken, verifyToken } from "../../../shared/utils";
import { EXPIRES_IN } from "../../../shared/constants";

type RefreshTokenRequest = {
    refreshToken: string;
};

type RefreshTokenResponse = {
    token: string;
    expiresIn: number;
    refreshToken: string;
};

export const refreshToken = api<RefreshTokenRequest, RefreshTokenResponse>(
    {
        expose: true,
        auth: false,
        method: "POST",
        path: "/refresh-token",
    },
    async ({ refreshToken }) => {
        const decoded = verifyToken(refreshToken);

        if (typeof decoded === "string" || !decoded) {
            throw APIError.unauthenticated("bad credentials");
        }

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            throw APIError.unauthenticated("bad credentials");
        }

        const userId = Number(decoded.userId);
    

        return {
            token: generateToken(userId),
            expiresIn: EXPIRES_IN,
            refreshToken: generateRefreshToken(userId),
        };
    }
);


