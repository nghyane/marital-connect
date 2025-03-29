import { BaseResponse } from "../../../shared/types";


export interface PublicProfile {
    bio?: string;
    avatarUrl?: string;
    location?: string;
    website?: string;
    phoneNumber?: string;
    birthDate?: Date;
}

export interface PublicUser {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    profile?: PublicProfile | null;
 }

export interface ProfileRequest {
    name?: string;
    email?: string;
    profile?: Partial<PublicProfile>;
}

export interface ProfileResponse extends BaseResponse<any> {
        
}

export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
}

export interface UpdateProfileResponse extends BaseResponse<any> {
    
} 