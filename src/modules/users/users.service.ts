import type { User } from "./users.types.js";
import type { CreateUserDto, UpdateUserDto } from "./users.dto.js";
import { prisma } from "../../common/utils/db.client.js";

export class UserService {
    async createUser(data: CreateUserDto) {
        // Administrative user creation - password should be set by auth module
        return prisma.user.create({
            data: {
                ...data,
                password: "ChangeMe123!@#", // Default password for newly created accounts
            },
        });
    }

    async getUsers() {
        return prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async updateUser(id: string, data: UpdateUserDto) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: string) {
        await prisma.user.delete({
            where: { id },
        });
        return true;
    }
}