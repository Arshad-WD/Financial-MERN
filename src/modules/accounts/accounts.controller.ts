import type { Response } from "express";
import type { AuthRequest } from "../../common/guards/auth.guard.js";
import { AccountService } from "./accounts.service.js";
import { catchAsync } from "../../common/decorators/catch-async.decorator.js";

const accountService = new AccountService();

export class AccountController {
    create = catchAsync(async (req: AuthRequest, res: Response) => {
        const account = await accountService.createAccount(req.user!.id, req.body);
        res.status(201).json(account);
    });

    findAll = catchAsync(async (req: AuthRequest, res: Response) => {
        const accounts = await accountService.getAccounts(req.user!.id);
        res.json(accounts);
    });

    delete = catchAsync(async (req: AuthRequest, res: Response) => {
        await accountService.deleteAccount(req.user!.id, req.params.id as string);
        res.status(204).send();
    });
}
