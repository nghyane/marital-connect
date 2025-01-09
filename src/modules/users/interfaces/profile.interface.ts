
import { AuthParams } from "../../auth/auth";
import { Header } from "encore.dev/api";

export interface PublicUser {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProfileRequest {

}

export interface ProfileResponse {
        user: PublicUser;
}