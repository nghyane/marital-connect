export interface PublicUser {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface ProfileRequest {

}

export interface ProfileResponse extends PublicUser {

}
