export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface RegisterResponse {
    token: string;
}

export interface RegisterInsert {
    email: string;
    password: string;
    name: string;
}
