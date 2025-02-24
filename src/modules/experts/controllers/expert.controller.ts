import { api, APIError } from "encore.dev/api";
import { expertService } from "../services/expert.service";
import { ExpertsResponse, ExpertDetailsRequest, ExpertDetailsResponse, CreateExpertRequest, CreateExpertResponse, ExpertsFilter } from "../interfaces/expert.interface";
import { getAuthData } from "~encore/auth";
import { ExpertAvailabilityStatus } from "../../../database/schemas/experts.schema";
export const experts = api<ExpertsFilter, ExpertsResponse>(
    {
        expose: true,
        auth: false,
        method: "GET",
        path: "/experts",
    },
    async (req) => {        
        const experts = await expertService.getAllExperts({
            name: req.name,
            location: req.location,
        });

        return {
            success: true,
            data: experts
        }
    }
);


export const expertProfile = api<ExpertDetailsRequest, ExpertDetailsResponse>(
    {
        expose: true,
        auth: false,
        method: "GET",
        path: "/experts/:id",
    },
    async (req) => {
        const { id } = req;
        const expert = await expertService.getExpertByUserId(id);

        if (!expert) {
            throw APIError.notFound("Expert not found");
        }

        return {
            success: true,
            data: expert
        };
    }
);

export const createExpert = api<CreateExpertRequest, CreateExpertResponse>(
    {
        expose: true,
        auth: true,
        method: "POST",
        path: "/experts",
    },
    async (req) => {
        const userID = Number(getAuthData()!.userID);


        const expert = await expertService.createExpert({
            ...req,
            user_id: userID,
            availability_status: ExpertAvailabilityStatus.ONLINE,
        });
        
        return {
            success: true,
            data: expert
        };
    }
);