import { prisma } from "../../common/utils/db.client.js";
import { hashPassword, comparePassword } from "../../common/utils/password.util.js";
import { generateToken } from "../../common/utils/jwt.util.js";
import type { RegisterDto, LoginDto } from "./auth.dto.js";

export class AuthService {
    async register(data: RegisterDto) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw { status: 400, message: "User already exists with this email" };
        }

        const hashedPassword = await hashPassword(data.password);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        return { user, token };
    }

    async login(data: LoginDto) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw { status: 401, message: "Invalid email or password" };
        }

        const isPasswordMatch = await comparePassword(data.password, user.password);

        if (!isPasswordMatch) {
            throw { status: 401, message: "Invalid email or password" };
        }

        if (user.status === "INACTIVE") {
            throw { status: 403, message: "Your account is deactivated. Please contact admin." };
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        return { user, token };
    }
}
