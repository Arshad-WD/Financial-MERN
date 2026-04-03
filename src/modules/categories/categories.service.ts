import { prisma } from "../../common/utils/db.client.js";
import type { CreateCategoryDto } from "./categories.dto.js";

export class CategoryService {
    async createCategory(userId: string, data: CreateCategoryDto) {
        return prisma.category.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async getCategories(userId: string) {
        return prisma.category.findMany({
            where: { userId },
            orderBy: { name: "asc" },
        });
    }

    async deleteCategory(userId: string, categoryId: string) {
        return prisma.category.delete({
            where: {
                id: categoryId,
                userId, // Ensure the category belongs to the user
            },
        });
    }
}
