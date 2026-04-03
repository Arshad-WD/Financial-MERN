import type { Request, Response, NextFunction } from "express";

/**
 * Higher-order function that catches errors in async Express handlers and passes them to next().
 * This eliminates the need for repeated try-catch blocks in controllers.
 */
export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
