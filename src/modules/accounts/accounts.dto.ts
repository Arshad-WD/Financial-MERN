import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["BANK", "CASH", "CREDIT_CARD", "SAVINGS", "INVESTMENT"]),
  balance: z.number().default(0),
});

export type CreateAccountDto = z.infer<typeof createAccountSchema>;
