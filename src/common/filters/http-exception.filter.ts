import type { Request, Response, NextFunction } from "express";
import { ErrorMessages } from "../constants/error-messages.js";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`[Error] ${req.method} ${req.url}:`, err);

    const status = err.status || 500;
    const message = err.message || ErrorMessages.INTERNAL_SERVER_ERROR;

    res.status(status).json({
        success: false,
        error: {
            message,
            status,
            path: req.url,
            timestamp: new Date().toISOString(),
        },
    });
};
