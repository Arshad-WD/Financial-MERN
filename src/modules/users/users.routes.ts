import { Router } from "express";
import { UsersController } from "./users.controller.js";
import { validationPipe } from "../../common/pipes/validation.pipe.js";
import { createUserSchema, updateUserSchema } from "./users.dto.js";
import { protect, authorize } from "../../common/guards/auth.guard.js";
import { Role } from "../../common/constants/roles.enum.js";

const router = Router();
const controller = new UsersController();

// Only admin can manage users
router.use(protect, authorize(Role.ADMIN));

router.post("/", validationPipe(createUserSchema), controller.create);
router.get("/", controller.findAll);

router.get("/:id", controller.findOne);
router.patch("/:id", validationPipe(updateUserSchema), controller.update);
router.delete("/:id", controller.delete);

export default router;
