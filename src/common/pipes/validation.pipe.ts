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
            return res.status(400).json({
                message: ErrorMessages.VALIDATION_FAILED,
                errors: result.error.issues,
            });
        }
        req.body = result.data; // <- cleaned data
        next();
    };
};
