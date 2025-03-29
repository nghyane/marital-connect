import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { apiResponse } from "../../../shared/api-response";
import { logger } from "../../../shared/logger";
import { adminWithdrawalService } from "../services/withdrawal.service";
import { 
    AdminUpdateWithdrawalStatusRequest, 
    AdminUpdateWithdrawalStatusResponse, 
    AdminWithdrawalsResponse 
} from "../interfaces/withdrawal.interface";

/**
 * Admin API - Lấy danh sách yêu cầu rút tiền
 */
export const getWithdrawals = api<{}, AdminWithdrawalsResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/admin/withdrawals",
    },
    async () => {
        try {
            const userID = Number(getAuthData()!.userID);
            
            // TODO: Kiểm tra quyền admin (sẽ phát triển trong version sau)
            // Tạm thời để đơn giản cho MVP
            
            // Lấy tất cả yêu cầu rút tiền
            const withdrawals = await adminWithdrawalService.getAllWithdrawals();
            
            logger.info("Admin retrieved withdrawal requests", { 
                adminId: userID, 
                count: withdrawals.length 
            });
            
            return apiResponse.success(
                { withdrawals }, 
                "Withdrawal requests retrieved successfully"
            );
        } catch (error) {
            logger.error(error, "Error retrieving withdrawal requests");
            throw error;
        }
    }
);

/**
 * Admin API - Cập nhật trạng thái yêu cầu rút tiền
 */
export const updateWithdrawalStatus = api<AdminUpdateWithdrawalStatusRequest, AdminUpdateWithdrawalStatusResponse>(
    {
        expose: true,
        auth: true,
        method: "PUT",
        path: "/admin/withdrawals/:id/status",
    },
    async (req) => {
        try {
            const { id } = req;
            const { status, notes } = req;
            const userID = Number(getAuthData()!.userID);
            
            // TODO: Kiểm tra quyền admin (sẽ phát triển trong version sau)
            // Tạm thời để đơn giản cho MVP
            
            // Cập nhật trạng thái
            const withdrawal = await adminWithdrawalService.updateWithdrawalStatus(
                Number(id), 
                status, 
                notes
            );
            
            logger.info("Admin updated withdrawal status", { 
                adminId: userID, 
                withdrawalId: id,
                status
            });
            
            return apiResponse.success(
                withdrawal, 
                `Withdrawal request ${status === 'completed' ? 'approved' : 'rejected'} successfully`
            );
        } catch (error) {
            logger.error(error, "Error updating withdrawal status");
            throw error;
        }
    }
); 