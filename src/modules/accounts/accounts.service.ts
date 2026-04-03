import { prisma } from "../../common/utils/db.client.js";
import type { CreateAccountDto } from "./accounts.dto.js";

export class AccountService {
    async createAccount(userId: string, data: CreateAccountDto) {
        return prisma.account.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async getAccounts(userId: string) {
        return prisma.account.findMany({
            where: { userId },
            orderBy: { name: "asc" },
        });
    }

    async deleteAccount(userId: string, accountId: string) {
        return prisma.account.delete({
            where: {
                id: accountId,
                userId,
            },
        });
    }
}
