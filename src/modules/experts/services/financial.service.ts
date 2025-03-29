import { db } from "../../../database/drizzle";
import { WithdrawalStatus, withdrawals } from "../../../database/schemas/withdrawals.schema";
import { PaymentStatus, payments } from "../../../database/schemas/payments.schema";
import { eq, and, sum, inArray } from "drizzle-orm";
import { experts } from "../../../database/schemas/experts.schema";
import { PAYMENT_CONFIG } from "../../payments/config/payment.config";
import { CreateWithdrawalRequest } from "../interfaces/financial.interface";
import { APIError } from "encore.dev/api";

export const financialService = {
    /**
     * Get the total earnings for an expert (all completed payments)
     */
    getTotalEarnings: async (expertId: number): Promise<number> => {
        const totalResult = await db
            .select({
                total: sum(payments.amount)
            })
            .from(payments)
            .where(
                and(
                    eq(payments.expert_id, expertId),
                    eq(payments.status, PaymentStatus.PAID)
                )
            );
        
        const total = Number(totalResult[0]?.total || 0);
        return total / PAYMENT_CONFIG.PRICE_TO_CENTS_MULTIPLIER;
    },

    /**
     * Get the total amount of pending withdrawals
     */
    getPendingWithdrawals: async (expertId: number): Promise<number> => {
        const pendingResult = await db
            .select({
                total: sum(withdrawals.amount)
            })
            .from(withdrawals)
            .where(
                and(
                    eq(withdrawals.expert_id, expertId),
                    inArray(withdrawals.status, [WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING])
                )
            );
        
        return Number(pendingResult[0]?.total || 0);
    },

    /**
     * Calculate the amount available for withdrawal
     */
    getAvailableForWithdrawal: async (expertId: number): Promise<number> => {
        const totalEarnings = await financialService.getTotalEarnings(expertId);
        
        // Get all withdrawals (completed and pending)
        const allWithdrawalsResult = await db
            .select({
                total: sum(withdrawals.amount)
            })
            .from(withdrawals)
            .where(
                eq(withdrawals.expert_id, expertId)
            );
        
        const allWithdrawals = Number(allWithdrawalsResult[0]?.total || 0);
        
        // Available = Total earnings - All withdrawals (both completed and pending)
        return totalEarnings - allWithdrawals;
    },

    /**
     * Get expert's complete financial summary in optimized queries
     * Returns total balance, available for withdrawal, and pending withdrawals
     */
    getExpertFinancialSummary: async (expertId: number): Promise<{
        totalBalance: number;
        availableForWithdrawal: number;
        pendingWithdrawals: number;
    }> => {
        // Run all queries in parallel with Promise.all
        const [totalEarningsResult, allWithdrawalsResult, pendingWithdrawalsResult] = await Promise.all([
            // Query 1: Get total earnings from paid payments
            db.select({
                total: sum(payments.amount)
            })
            .from(payments)
            .where(
                and(
                    eq(payments.expert_id, expertId),
                    eq(payments.status, PaymentStatus.PAID)
                )
            ),
            
            // Query 2: Get all withdrawals
            db.select({
                total: sum(withdrawals.amount)
            })
            .from(withdrawals)
            .where(eq(withdrawals.expert_id, expertId)),
            
            // Query 3: Get pending withdrawals
            db.select({
                total: sum(withdrawals.amount)
            })
            .from(withdrawals)
            .where(
                and(
                    eq(withdrawals.expert_id, expertId),
                    inArray(withdrawals.status, [WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING])
                )
            )
        ]);
        
        // Calculate financial information
        const totalEarnings = Number(totalEarningsResult[0]?.total || 0) / PAYMENT_CONFIG.PRICE_TO_CENTS_MULTIPLIER;
        const allWithdrawals = Number(allWithdrawalsResult[0]?.total || 0);
        const pendingWithdrawals = Number(pendingWithdrawalsResult[0]?.total || 0);
        
        return {
            totalBalance: totalEarnings,
            availableForWithdrawal: totalEarnings - allWithdrawals,
            pendingWithdrawals: pendingWithdrawals
        };
    },

    /**
     * Create a new withdrawal request
     */
    createWithdrawal: async (expertId: number, data: CreateWithdrawalRequest) => {
        // Get current available balance
        const { availableForWithdrawal } = await financialService.getExpertFinancialSummary(expertId);
        
        // Validate withdrawal amount
        if (data.amount > availableForWithdrawal) {
            throw APIError.invalidArgument(`Insufficient funds for withdrawal. Available: ${availableForWithdrawal}`);
        }
        

        if (data.amount < 50) {
            throw APIError.invalidArgument("Minimum withdrawal amount is 50 USD");
        }
        
        // Create withdrawal request
        const [withdrawal] = await db.insert(withdrawals).values({
            expert_id: expertId,
            amount: data.amount,
            status: WithdrawalStatus.PENDING,
            bank_account: data.bank_account,
            bank_name: data.bank_name,
            account_holder: data.account_holder,
            notes: data.notes
        }).returning();
        
        return withdrawal;
    },

    /**
     * Get all withdrawal requests for an expert
     */
    getWithdrawalHistory: async (expertId: number) => {
        return db.query.withdrawals.findMany({
            where: eq(withdrawals.expert_id, expertId),
            orderBy: (withdrawals, { desc }) => [desc(withdrawals.created_at)]
        });
    },
    
    /**
     * Lấy thông tin chi tiết của một yêu cầu rút tiền
     */
    getWithdrawalById: async (withdrawalId: number, expertId: number) => {
        const withdrawal = await db.query.withdrawals.findFirst({
            where: and(
                eq(withdrawals.id, withdrawalId),
                eq(withdrawals.expert_id, expertId)
            )
        });
        
        if (!withdrawal) {
            throw APIError.notFound("Withdrawal request not found");
        }
        
        return withdrawal;
    }
}; 