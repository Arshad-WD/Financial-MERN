import { prisma } from "../../common/utils/db.client.js";

export class DashboardService {
    async getSummary(userId: string) {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            include: { category: true },
        });

        const summary = transactions.reduce(
            (acc: { totalIncome: number; totalExpenses: number }, curr: any) => {
                if (curr.category.type === "INCOME") {
                    acc.totalIncome += curr.amount;
                } else {
                    acc.totalExpenses += curr.amount;
                }
                return acc;
            },
            { totalIncome: 0, totalExpenses: 0 }
        );

        return {
            ...summary,
            netBalance: summary.totalIncome - summary.totalExpenses,
        };
    }

    async getCategoryBreakdown(userId: string) {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            include: { category: true },
        });

        const breakdown: Record<string, { amount: number; type: string }> = {};

        transactions.forEach((t: any) => {
            const catName = t.category.name;
            if (!breakdown[catName]) {
                breakdown[catName] = { amount: 0, type: t.category.type };
            }
            breakdown[catName].amount += t.amount;
        });

        return Object.entries(breakdown).map(([name, data]) => ({
            name,
            value: data.amount,
            type: data.type,
        }));
    }

    async getRecentActivity(userId: string) {
        return prisma.transaction.findMany({
            where: { userId },
            include: { category: true, account: true },
            orderBy: { date: "desc" },
            take: 5,
        });
    }

    async getTrends(userId: string) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: thirtyDaysAgo },
            },
            include: { category: true },
            orderBy: { date: "asc" },
        });

        // Group by date
        const trends: Record<string, { income: number; expense: number }> = {};

        transactions.forEach((t: any) => {
            const dateStr = t.date.toISOString().split("T")[0];
            if (!trends[dateStr]) {
                trends[dateStr] = { income: 0, expense: 0 };
            }

            if (t.category.type === "INCOME") {
                trends[dateStr].income += t.amount;
            } else {
                trends[dateStr].expense += t.amount;
            }
        });

        return Object.entries(trends).map(([date, data]) => ({
            date,
            ...data,
        }));
    }
}
