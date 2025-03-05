import { authHandler } from "encore.dev/auth";
import { Header, Gateway, APIError } from "encore.dev/api";
import { verifyToken } from "../../shared/utils";

export interface AuthParams {
    authorization: Header<"Authorization">;
}

export interface AuthData {
    userID: string;
}

export const auth = authHandler<AuthParams, AuthData>(
    async (params) => {
        if (!params.authorization) {
            throw APIError.unauthenticated("no authorization header provided");
        }

        const token = params.authorization.replace(/^Bearer\s+/i, "").trim();

        if (!token) {
            throw APIError.unauthenticated("bad credentials");
        }

        const decoded = verifyToken(token);

        if (typeof decoded === "string" || !decoded) {
            throw APIError.unauthenticated("bad credentials");
        }

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            throw APIError.unauthenticated("bad credentials");
        }

        return {
            userID: `${decoded.userId}`,
        };
    }
);

export const gateway = new Gateway({
    authHandler: auth,
})