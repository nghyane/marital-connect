import { BaseResponse } from "../shared/types";

export const apiResponse = {
    success: <T>(data: T, message?: string): BaseResponse<T> => ({
        data,
        success: true,
        message
    }),
    
    error: <T>(data: T, message: string): BaseResponse<T> => ({
        data,
        success: false,
        message
    })
}; 