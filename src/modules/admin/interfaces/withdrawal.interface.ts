import { BaseResponse } from "../../../shared/types";
import { WithdrawalStatus } from "../../../database/schemas/withdrawals.schema";

/**
 * Giao diện cho API lấy danh sách withdrawal của admin
 */
export interface AdminWithdrawalsResponse extends BaseResponse<{
    withdrawals: any[];
}> {}

/**
 * Request để cập nhật trạng thái withdrawal
 */
export interface AdminUpdateWithdrawalStatusRequest {
    id: string; // ID của withdrawal
    status: WithdrawalStatus; // Trạng thái mới (completed/rejected)
    notes?: string; // Ghi chú thêm (lý do từ chối...)
}

/**
 * Response cho API cập nhật trạng thái
 */
export interface AdminUpdateWithdrawalStatusResponse extends BaseResponse<any> {} 