import { BaseResponse } from "../../../shared/types";


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

export type ExpertDetailsResponse = BaseResponse<ExpertDetailsData>;

export interface ExpertsFilter {
    readonly name?: string;
    readonly location?: string;
    readonly title?: string;
    readonly specialties?: string[];
    readonly experience?: number;
    readonly availability_status?: "online" | "offline" | "busy" | "away";
}

export type ExpertsRequest = ExpertsFilter;

export type ExpertsResponse = BaseResponse<ExpertDetailsData[]>;

export interface CreateExpertRequest {
    readonly title: string;
    readonly location: string;
    readonly experience: number;
    readonly specialties: readonly string[];
    readonly about: string;
}

export type CreateExpertResponse = BaseResponse<ExpertDetailsData>;

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

export interface ExpertServicesListResponse {
    success: boolean;
    data: ExpertService[];
    count: number;
}