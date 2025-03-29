import { api, APIError } from "encore.dev/api";
import { expertService } from "../services/expert.service";
import { ExpertsResponse, ExpertDetailsRequest, ExpertDetailsResponse, CreateExpertRequest, CreateExpertResponse, ExpertsFilter, ExpertClientsResponse, ClientDetailsRequest, ClientDetailsResponse, UpdateExpertProfileRequest, UpdateExpertProfileResponse } from "../interfaces/expert.interface";
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
            google_meet_link: null,
        });
        
        return {
            success: true,
            data: expert
        };
    }
);

export const getCurrentExpertProfile = api<{}, ExpertDetailsResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/experts/profile",
    },
    async () => {
        const userID = Number(getAuthData()!.userID);
        logger.info("Current expert profile request", { userId: userID });
        
        try {
            const user = await userService.getUser(userID);
            
            if (!user) {
                logger.warn("User not found", { userId: userID });
                throw APIError.notFound("User not found");
            }
            
            if (user.role.name !== "expert") {
                logger.warn("User is not an expert", { userId: userID, role: user.role.name });
                throw APIError.permissionDenied("User is not an expert");
            }
            
            const expert = await expertService.getExpertByUserId(userID, false);

            if (!expert) {
                logger.warn("Expert profile not found", { userId: userID });
                throw APIError.notFound("Expert profile not found. Please complete your profile setup.");
            }

            logger.info("Current expert profile retrieved", { userId: userID });
            return apiResponse.success(expert, "Expert profile retrieved successfully");
        } catch (error) {
            logger.error(error, "Error retrieving current expert profile", { userId: userID });
            throw error;
        }
    }
);

export const getExpertClients = api<{}, ExpertClientsResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/experts/clients",
    },
    async () => {
        const userID = Number(getAuthData()!.userID);
        logger.info("Expert clients list request", { userId: userID });
        
        try {
            const user = await userService.getUser(userID);
            
            if (!user) {
                logger.warn("User not found", { userId: userID });
                throw APIError.notFound("User not found");
            }
            
            if (user.role.name !== "expert") {
                logger.warn("User is not an expert", { userId: userID, role: user.role.name });
                throw APIError.permissionDenied("User is not an expert");
            }
            
            const expert = await expertService.getExpertByUserId(userID, false);

            if (!expert) {
                logger.warn("Expert profile not found", { userId: userID });
                throw APIError.notFound("Expert profile not found. Please complete your profile setup.");
            }

            const clients = await expertService.getExpertClients(expert.id);
            
            logger.info("Expert clients retrieved", { 
                userId: userID, 
                expertId: expert.id, 
                clientCount: clients.length 
            });
            
            return apiResponse.success(clients, "Expert clients retrieved successfully");
        } catch (error) {
            logger.error(error, "Error retrieving expert clients", { userId: userID });
            throw error;
        }
    }
);

export const getClientDetails = api<ClientDetailsRequest, ClientDetailsResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/experts/clients/:clientId",
    },
    async (req) => {
        const userID = Number(getAuthData()!.userID);
        const clientId = Number(req.clientId);
        
        logger.info("Client details request", { userId: userID, clientId });
        
        try {
            const user = await userService.getUser(userID);
            
            if (!user) {
                logger.warn("User not found", { userId: userID });
                throw APIError.notFound("User not found");
            }
            
            if (user.role.name !== "expert") {
                logger.warn("User is not an expert", { userId: userID, role: user.role.name });
                throw APIError.permissionDenied("User is not an expert");
            }
            
            const expert = await expertService.getExpertByUserId(userID, false);

            if (!expert) {
                logger.warn("Expert profile not found", { userId: userID });
                throw APIError.notFound("Expert profile not found. Please complete your profile setup.");
            }
            
            const clientDetails = await expertService.getClientDetails(expert.id, clientId);
            
            logger.info("Client details retrieved", { 
                expertId: expert.id, 
                clientId 
            });
            
            return apiResponse.success(clientDetails, "Client details retrieved successfully");
        } catch (error) {
            logger.error(error, "Error retrieving client details", { userId: userID, clientId });
            throw error;
        }
    }
);

export const updateExpertProfile = api<UpdateExpertProfileRequest, UpdateExpertProfileResponse>(
    {
        expose: true,
        auth: true,
        method: "PUT",
        path: "/experts/profile",
    },
    async (req) => {
        const userID = Number(getAuthData()!.userID);
        logger.info("Update expert profile request", { userId: userID });
        
        try {
            const user = await userService.getUser(userID);
            
            if (!user) {
                logger.warn("User not found", { userId: userID });
                throw APIError.notFound("User not found");
            }
            
            if (user.role.name !== "expert") {
                logger.warn("User is not an expert", { userId: userID, role: user.role.name });
                throw APIError.permissionDenied("User is not an expert");
            }
            
            const expert = await expertService.getExpertByUserId(userID, false);

            if (!expert) {
                logger.warn("Expert profile not found", { userId: userID });
                throw APIError.notFound("Expert profile not found. Please complete your profile setup.");
            }
            
            const updateData = {
                title: req.title,
                about: req.about,
                location: req.location,
                experience: req.experience,
                google_meet_link: req.google_meet_link,
                specialties: req.specialties,
                availability_status: req.availability_status
            };
            
            const updatedExpert = await expertService.updateExpertProfile(expert.id, updateData);
            
            logger.info("Expert profile updated successfully", {
                userId: userID,
                expertId: expert.id
            });
            
            return apiResponse.success(updatedExpert, "Expert profile updated successfully");
        } catch (error) {
            logger.error(error, "Error updating expert profile", { userId: userID });
            throw error;
        }
    }
);

