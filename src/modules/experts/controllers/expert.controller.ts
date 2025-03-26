import { api, APIError } from "encore.dev/api";
import { expertService } from "../services/expert.service";
import { ExpertsResponse, ExpertDetailsRequest, ExpertDetailsResponse, CreateExpertRequest, CreateExpertResponse, ExpertsFilter } from "../interfaces/expert.interface";
import { getAuthData } from "~encore/auth";
import { ExpertAvailabilityStatus } from "../../../database/schemas/experts.schema";
import { apiResponse } from "../../../shared/api-response";
import { logger } from "../../../shared/logger";
import { userService } from "../../../modules/users/services/user.service";

export const experts = api<ExpertsFilter, ExpertsResponse>(
    {
        expose: true,
        auth: false,
        method: "GET",
        path: "/experts",
    },
    async (req) => {
        logger.info("Experts list request", { 
            filterName: req.name,
            filterLocation: req.location
        });
        
        try {
            const expertsData = await expertService.getAllExperts({
                name: req.name,
                location: req.location,
            });
            
            logger.info("Experts list retrieved", { count: expertsData.length });
            return apiResponse.success(expertsData, "Experts retrieved successfully");
        } catch (error) {
            logger.error(error, "Error retrieving experts");
            throw error;
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
        logger.info("Expert profile request", { expertId: id });
        
        try {
            const expert = await expertService.getExpertByUserId(id);

            if (!expert) {
                logger.warn("Expert not found", { expertId: id });
                throw APIError.notFound("Expert not found");
            }

            logger.info("Expert profile retrieved", { expertId: id });
            return apiResponse.success(expert, "Expert profile retrieved successfully");
        } catch (error) {
            logger.error(error, "Error retrieving expert profile", { expertId: id });
            throw error;
        }
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

        const user = await userService.getUser(userID);

        if (!user) {
            throw APIError.notFound("Expert not found");
        }

        if (user.role.name !== "expert") {
            throw APIError.permissionDenied("User is not an expert");
        }
        

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

