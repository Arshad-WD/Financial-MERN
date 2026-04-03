import type { Request, Response, NextFunction } from "express";

export const responseInterceptor = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (data: any): Response {
        // If data is already in the standard format or is an error response, don't wrap it.
        if (data && (data.success !== undefined || data.error !== undefined)) {
            return originalJson.call(this, data);
        }

        const transformedResponse = {
            success: true,
            data,
            timestamp: new Date().toISOString(),
        };

        return originalJson.call(this, transformedResponse);
    };

    next();
};
