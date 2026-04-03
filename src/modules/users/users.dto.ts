import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["VIEWER", "ANALYST", "ADMIN"]),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();
export type UpdateUserDto = z.infer<typeof updateUserSchema>;