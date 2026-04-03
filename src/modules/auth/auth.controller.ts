import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { catchAsync } from "../../common/decorators/catch-async.decorator.js";

const authService = new AuthService();

export class AuthController {
    register = catchAsync(async (req: Request, res: Response) => {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({ user, token });
    });

    login = catchAsync(async (req: Request, res: Response) => {
        const { user, token } = await authService.login(req.body);
        res.json({ user, token });
    });
}
