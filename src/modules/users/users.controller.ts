import type { Request, Response } from "express";
import { UserService } from "./users.service.js";
import { catchAsync } from "../../common/decorators/catch-async.decorator.js";

const userService = new UserService();

export class UsersController {
    create = catchAsync(async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    });

    findAll = catchAsync(async (req: Request, res: Response) => {
        const users = await userService.getUsers();
        res.json(users);
    });

    findOne = catchAsync(async (req: Request, res: Response) => {
        const user = await userService.getUserById(req.params.id as string);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    });

    update = catchAsync(async (req: Request, res: Response) => {
        const user = await userService.updateUser(req.params.id as string, req.body);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    });

    delete = catchAsync(async (req: Request, res: Response) => {
        const success = await userService.deleteUser(req.params.id as string);
        if (!success) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(204).send();
    });
}