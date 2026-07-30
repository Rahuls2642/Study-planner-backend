import { Router } from "express";

import { register, login, refresh, logout } from "../controllers/auth.controller";
import { validate } from "@/middleware/validate";
import { registerSchema } from "../validations/register.validation";
import { loginSchema } from "../validations/login.validation";
import { refreshSchema } from "../validations/refresh.validation";
import { authenticate } from "@/middleware/authenticate";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", logout);

router.get(
    "/protected",
    authenticate,
    (req, res) => {
        res.json({
            success: true,
            user: req.user,
        });
    }
);
export default router;
