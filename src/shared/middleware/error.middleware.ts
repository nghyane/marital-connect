import { middleware } from "encore.dev/api";

export const errorMiddleware = middleware({}, async (req, next) => {
    try {
        return await next(req);
    } catch (error) {
        // Log the error
        console.error("API Error:", error);
        
        // Rethrow the error to let Encore handle it
        throw error;
    }
}); 