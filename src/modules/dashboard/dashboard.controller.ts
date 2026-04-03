import type { Response } from "express";
import { DashboardService } from "./dashboard.service.js";
import type { AuthRequest } from "../../common/guards/auth.guard.js";
import { catchAsync } from "../../common/decorators/catch-async.decorator.js";

const dashboardService = new DashboardService();

export class DashboardController {
    getSummary = catchAsync(async (req: AuthRequest, res: Response) => {
        const summary = await dashboardService.getSummary(req.user!.id);
        res.json(summary);
    });

    getCategoryBreakdown = catchAsync(async (req: AuthRequest, res: Response) => {
        const breakdown = await dashboardService.getCategoryBreakdown(req.user!.id);
        res.json(breakdown);
    });

    getRecentActivity = catchAsync(async (req: AuthRequest, res: Response) => {
        const activity = await dashboardService.getRecentActivity(req.user!.id);
        res.json(activity);
    });

    getTrends = catchAsync(async (req: AuthRequest, res: Response) => {
        const trends = await dashboardService.getTrends(req.user!.id);
        res.json(trends);
    });
}
