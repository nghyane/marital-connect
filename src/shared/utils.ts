import { createHash } from "node:crypto";
import jwt from 'jsonwebtoken';

export const hashPassword = (password: string) => {
    return createHash("sha256").update(password).digest("hex");
};

export const comparePassword = (password: string, hashedPassword: string) => {
    return hashPassword(password) === hashedPassword;
};

export const generateToken = (userId: number) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

