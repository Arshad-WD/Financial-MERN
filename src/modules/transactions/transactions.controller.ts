import type { Response } from "express";
import type { AuthRequest } from "../../common/guards/auth.guard.js";
import { TransactionService } from "./transactions.service.js";
import { catchAsync } from "../../common/decorators/catch-async.decorator.js";

const transactionService = new TransactionService();

export class TransactionController {
    create = catchAsync(async (req: AuthRequest, res: Response) => {
        const transaction = await transactionService.createTransaction(req.user!.id, req.body);
        res.status(201).json(transaction);
    });

    findAll = catchAsync(async (req: AuthRequest, res: Response) => {
        const { type, categoryId, startDate, endDate } = req.query;
        const transactions = await transactionService.getTransactions(req.user!.id, {
            type: type as string,
            categoryId: categoryId as string,
            startDate: startDate as string,
            endDate: endDate as string,
        });
        res.json(transactions);
    });

    delete = catchAsync(async (req: AuthRequest, res: Response) => {
        await transactionService.deleteTransaction(req.user!.id, req.params.id as string);
        res.status(204).send();
    });
}
