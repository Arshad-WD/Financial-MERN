import jwt from "jsonwebtoken";
import { env } from "../../config/env.config.js";

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as any,
    });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};
