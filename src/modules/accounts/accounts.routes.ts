import { Router } from "express";
import { AccountController } from "./accounts.controller.js";
import { protect, authorize } from "../../common/guards/auth.guard.js";
import { validationPipe } from "../../common/pipes/validation.pipe.js";
import { createAccountSchema } from "./accounts.dto.js";
import { Role } from "../../common/constants/roles.enum.js";

const router = Router();
const controller = new AccountController();

router.get("/", protect, authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), controller.findAll);
router.post("/", protect, authorize(Role.ADMIN, Role.VIEWER), validationPipe(createAccountSchema), controller.create);
router.delete("/:id", protect, authorize(Role.ADMIN, Role.VIEWER), controller.delete);

export default router;
