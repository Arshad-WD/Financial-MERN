import { Router } from "express";
import { TransactionController } from "./transactions.controller.js";
import { protect, authorize } from "../../common/guards/auth.guard.js";
import { validationPipe } from "../../common/pipes/validation.pipe.js";
import { createTransactionSchema } from "./transactions.dto.js";
import { Role } from "../../common/constants/roles.enum.js";

const router = Router();
const controller = new TransactionController();

// Role-based access control:
// Analyst: Read-only access to records
// Admin: Full management (create, read, delete)
// Viewer: Restricted to dashboard only
router.get("/", protect, authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), controller.findAll);
router.post("/", protect, authorize(Role.ADMIN, Role.VIEWER), validationPipe(createTransactionSchema), controller.create);
router.delete("/:id", protect, authorize(Role.ADMIN, Role.VIEWER), controller.delete);

export default router;
