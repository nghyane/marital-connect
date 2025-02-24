export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    passwordConfirmation: string;
    accountType: 'expert' | 'customer';
}

export interface RegisterResponse {
    data: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }
    message?: string;
}

export interface RegisterInsert {
    email: string;
    password: string;
    name: string;
    roleId: number;
}
