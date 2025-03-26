import { createHash } from "node:crypto";


export const hashPassword = (password: string) => {
    return createHash("sha256").update(password).digest("hex");
};

export const comparePassword = (password: string, hashedPassword: string) => {
    return hashPassword(password) === hashedPassword;
};

export const validateContent = (content: string) => {
    return true;
};

