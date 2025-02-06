import { createHash } from "node:crypto";
import jwt from 'jsonwebtoken';
import { EXPIRES_IN } from "./constants";

export const hashPassword = (password: string) => {
    return createHash("sha256").update(password).digest("hex");
};

export const comparePassword = (password: string, hashedPassword: string) => {
    return hashPassword(password) === hashedPassword;
};

export const generateToken = (userId: number) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const validateContent = (content: string) => {
    return true;
};

