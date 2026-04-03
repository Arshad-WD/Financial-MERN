import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { protect } from "../../common/guards/auth.guard.js";

const router = Router();
const controller = new DashboardController();

// All authenticated roles (Viewer, Analyst, Admin) can view dashboard data
router.use(protect);

router.get("/summary", controller.getSummary);
router.get("/categories", controller.getCategoryBreakdown);
router.get("/recent", controller.getRecentActivity);
router.get("/trends", controller.getTrends);

export default router;
