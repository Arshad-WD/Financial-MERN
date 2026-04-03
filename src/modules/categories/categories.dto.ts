import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
