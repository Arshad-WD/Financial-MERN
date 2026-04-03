import { prisma } from "../../common/utils/db.client.js";
import type { CreateTransactionDto } from "./transactions.dto.js";

export class TransactionService {
    async createTransaction(userId: string, data: CreateTransactionDto) {
        // Use a transaction to ensure atomic balance update
        return (prisma as any).$transaction(async (tx: any) => {
            const transaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId,
                },
                include: {
                    category: true,
                },
            });

            // Update account balance
            // If expense, subtract. If income, add.
            const amountChange = transaction.category.type === "INCOME" ? data.amount : -data.amount;

            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        increment: amountChange,
                    },
                },
            });

            return transaction;
        });
    }

    async getTransactions(userId: string, filters: { type?: string; categoryId?: string; startDate?: string; endDate?: string } = {}) {
        const { type, categoryId, startDate, endDate } = filters;

        const where: any = { userId };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (type) {
            where.category = { type };
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        return prisma.transaction.findMany({
            where,
            include: {
                account: true,
                category: true,
            },
            orderBy: { date: "desc" },
        });
    }

    async deleteTransaction(userId: string, transactionId: string) {
        return (prisma as any).$transaction(async (tx: any) => {
            const transaction = await tx.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { category: true },
            });

            if (!transaction) throw { status: 404, message: "Transaction not found" };

            // Revert account balance
            const amountChange = transaction.category.type === "INCOME" ? -transaction.amount : transaction.amount;

            await tx.account.update({
                where: { id: transaction.accountId },
                data: {
                    balance: {
                        increment: amountChange,
                    },
                },
            });

            return tx.transaction.delete({
                where: { id: transactionId },
            });
        });
    }
}
