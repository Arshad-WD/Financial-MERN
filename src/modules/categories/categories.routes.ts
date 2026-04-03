import { Router } from "express";
import { CategoryController } from "./categories.controller.js";
import { protect, authorize } from "../../common/guards/auth.guard.js";
import { validationPipe } from "../../common/pipes/validation.pipe.js";
import { createCategorySchema } from "./categories.dto.js";
import { Role } from "../../common/constants/roles.enum.js";

const router = Router();
const controller = new CategoryController();

router.get("/", protect, authorize(Role.ADMIN, Role.ANALYST), controller.findAll);
router.post("/", protect, authorize(Role.ADMIN), validationPipe(createCategorySchema), controller.create);
router.delete("/:id", protect, authorize(Role.ADMIN), controller.delete);

export default router;
