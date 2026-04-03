import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validationPipe } from "../../common/pipes/validation.pipe.js";
import { registerSchema, loginSchema } from "./auth.dto.js";

const router = Router();
const controller = new AuthController();

router.post("/register", validationPipe(registerSchema), controller.register);
router.post("/login", validationPipe(loginSchema), controller.login);

export default router;
