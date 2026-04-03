import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number(),
  description: z.string().optional(),
  date: z.string().optional().transform((val) => val ? new Date(val) : new Date()),
  merchant: z.string().optional(),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid(),
});

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
