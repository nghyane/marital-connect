import { api } from "encore.dev/api";
import { authService } from "../services/auth.service";

import { LoginRequest, LoginResponse } from "../interfaces/login.interface";

export const login = api<LoginRequest, LoginResponse>(
    {
        method: "POST",
        path: "/login",
    },
    async (req) => {
        const { email, password } = req;

        const user = await authService.login(email, password);

        console.log(user);
        

        return {
            token: "1234567890",
        };
    }
);