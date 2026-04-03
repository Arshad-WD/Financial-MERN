import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ErrorMessages } from "../constants/error-messages.js";

/**
 * Common validation pipe using Zod schemas. This replaces standard validation middleware
 * while following a professional naming convention.
 */
export const validationPipe = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const firstErrorMessage = result.error.issues[0]?.message || ErrorMessages.VALIDATION_FAILED;
            return res.status(400).json({
                success: false,
                error: {
                    message: firstErrorMessage,
                    details: result.error.issues,
                    status: 400
                }
            });
        }
        req.body = result.data; // <- cleaned data
        next();
    };
};
