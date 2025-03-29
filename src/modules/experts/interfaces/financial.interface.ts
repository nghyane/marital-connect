import { BaseResponse } from "../../../shared/types";
import { Withdrawal } from "../../../database/schemas/withdrawals.schema";

export interface ExpertFinancialData {
    totalBalance: number;
    availableForWithdrawal: number;
    pendingWithdrawals: number;
}

export interface ExpertFinancialResponse extends BaseResponse<ExpertFinancialData> {
}

export interface CreateWithdrawalRequest {
    amount: number;
    bank_account: string;
    bank_name: string;
    account_holder: string;
    notes?: string;
}

export interface CreateWithdrawalResponse extends BaseResponse<any> {
}

export interface WithdrawalHistoryResponse extends BaseResponse<{
    withdrawals: any[];
}> {
}

export interface WithdrawalDetailsRequest {
    id: string;
}

export interface WithdrawalDetailsResponse extends BaseResponse<any> {} 