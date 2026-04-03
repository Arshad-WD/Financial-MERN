import type { Response } from "express";
import type { AuthRequest } from "../../common/guards/auth.guard.js";
import { CategoryService } from "./categories.service.js";
import { catchAsync } from "../../common/decorators/catch-async.decorator.js";

const categoryService = new CategoryService();

export class CategoryController {
    create = catchAsync(async (req: AuthRequest, res: Response) => {
        const category = await categoryService.createCategory(req.user!.id, req.body);
        res.status(201).json(category);
    });

    findAll = catchAsync(async (req: AuthRequest, res: Response) => {
        const categories = await categoryService.getCategories(req.user!.id);
        res.json(categories);
    });

    delete = catchAsync(async (req: AuthRequest, res: Response) => {
        await categoryService.deleteCategory(req.user!.id, req.params.id as string);
        res.status(204).send();
    });
}
