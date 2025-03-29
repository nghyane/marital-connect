import { BaseResponse } from "../../../shared/types";
import { CertificationVerificationStatus } from "../../../database/schemas/expert-certifications.schema";
import { ExpertAvailabilityStatus } from "../../../database/schemas/experts.schema";


// Expert education type
export interface ExpertEducation {
    readonly institution: string;
    readonly degree: string;
    readonly year: string;
}

// Expert certification type
export interface ExpertCertification {
    readonly name: string;
    readonly issuer: string;
    readonly year: string;
    readonly expiry_date: Date | null;
    readonly verification_status: CertificationVerificationStatus;
    readonly certificate_file_url?: string;
}

// Expert service type
export interface ExpertService {
    readonly name: string;
    readonly duration: string;
    readonly price: number;
    readonly description: string | null;
}

// Expert details data
export interface ExpertDetailsData {
    readonly user_id: number;
    readonly title: string;
    readonly location: string;
    readonly experience: number;
    readonly specialties: readonly string[];
    readonly availability_status: string;
    readonly about: string;
    readonly education?: readonly ExpertEducation[];
    readonly certifications?: readonly ExpertCertification[];
    readonly services?: readonly ExpertService[];
}

export interface ExpertDetailsRequest {
    readonly id: number;
}

export interface ExpertDetailsResponse extends BaseResponse<ExpertDetailsData> {}

export interface ExpertsFilter {
    readonly name?: string;
    readonly location?: string;
    readonly title?: string;
    readonly specialties?: string[];
    readonly experience?: number;
    readonly availability_status?: "online" | "offline" | "busy" | "away";
}

export interface ExpertsResponse extends BaseResponse<ExpertDetailsData[]> {}

export interface CreateExpertRequest {
    readonly title: string;
    readonly location: string;
    readonly experience: number;
    readonly specialties: readonly string[];
    readonly about: string;
}

export interface CreateExpertResponse {
    success: boolean;
    data: any;
}

export interface CreateExpertServiceRequest {
    name: string;
    duration: '30min' | '45min' | '60min' | '90min';
    price: number;
    description?: string;
}

export interface ExpertServiceResponse {
    success: boolean;
    data: ExpertService;
}

export interface ExpertClientsResponse extends BaseResponse<ExpertClient[]> {}

export interface ExpertClient {
    readonly user_id: number;
    readonly name: string;
    readonly email: string;
    readonly last_appointment: string | null;
    readonly next_appointment: string | null;
    readonly next_appointment_status: string | null;
    readonly appointment_count: number;
    readonly account_status: string; // User account status
}

export interface ClientDetailsRequest {
    readonly clientId: string;
}

export interface ClientDetailsResponse extends BaseResponse<any> {}

export interface UpdateExpertProfileRequest {
    readonly title?: string;
    readonly about?: string;
    readonly location?: string;
    readonly experience?: number;
    readonly google_meet_link?: string | null;
    readonly specialties?: string[];
    readonly availability_status?: ExpertAvailabilityStatus;
}

export interface UpdateExpertProfileResponse extends BaseResponse<ExpertDetailsData> {}

