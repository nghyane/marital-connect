import { db } from "../../../database/drizzle";
import { WithdrawalStatus, withdrawals } from "../../../database/schemas/withdrawals.schema";
import { eq } from "drizzle-orm";
import { APIError } from "encore.dev/api";

export const adminWithdrawalService = {
    /**
     * Lấy tất cả yêu cầu rút tiền
     */
    getAllWithdrawals: async () => {
        return db.query.withdrawals.findMany({
            orderBy: (withdrawals, { desc }) => [desc(withdrawals.created_at)],
            with: {
                expert: {
                    with: {
                        user: true
                    }
                }
            }
        });
    },

    /**
     * Lấy tất cả yêu cầu rút tiền đang chờ xử lý
     */
    getPendingWithdrawals: async () => {
        return db.query.withdrawals.findMany({
            where: eq(withdrawals.status, WithdrawalStatus.PENDING),
            orderBy: (withdrawals, { desc }) => [desc(withdrawals.created_at)],
            with: {
                expert: {
                    with: {
                        user: true
                    }
                }
            }
        });
    },

    /**
     * Cập nhật trạng thái yêu cầu rút tiền
     */
    updateWithdrawalStatus: async (withdrawalId: number, status: WithdrawalStatus, notes?: string) => {
        // Kiểm tra yêu cầu rút tiền tồn tại
        const withdrawal = await db.query.withdrawals.findFirst({
            where: eq(withdrawals.id, withdrawalId)
        });

        if (!withdrawal) {
            throw APIError.notFound("Withdrawal request not found");
        }

        // Kiểm tra trạng thái hiện tại
        if (withdrawal.status !== WithdrawalStatus.PENDING) {
            throw APIError.failedPrecondition("This withdrawal request has already been processed");
        }

        // Cập nhật trạng thái
        const [updatedWithdrawal] = await db.update(withdrawals)
            .set({
                status,
                notes: notes || withdrawal.notes,
                updated_at: new Date()
            })
            .where(eq(withdrawals.id, withdrawalId))
            .returning();

        return updatedWithdrawal;
    }
}; 