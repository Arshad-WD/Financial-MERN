import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util.js";
import { ErrorMessages } from "../constants/error-messages.js";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            message: ErrorMessages.NOT_AUTHORIZED,
        });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                message: ErrorMessages.INVALID_TOKEN,
            });
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: ErrorMessages.INVALID_TOKEN,
        });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                message: ErrorMessages.NOT_AUTHORIZED,
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: ErrorMessages.ACCESS_FORBIDDEN,
            });
        }

        next();
    };
};
