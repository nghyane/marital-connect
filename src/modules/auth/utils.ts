import { REFRESH_TOKEN_EXPIRES_IN, EXPIRES_IN } from "../../shared/constants";
import jwt from "jsonwebtoken";

import { secret } from "encore.dev/config";

const jwtSecret = secret("JWT_SECRET");

export const generateToken = (userId: number) => {    
    return jwt.sign({ userId }, jwtSecret(), { expiresIn: EXPIRES_IN });
};

export const generateRefreshToken = (userId: number) => {
    return jwt.sign({ userId }, jwtSecret(), { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, jwtSecret());
};
