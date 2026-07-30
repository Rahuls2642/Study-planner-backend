import { Router } from "express";

import { register, login, refresh, logout } from "../controllers/auth.controller";
import { validate } from "@/middleware/validate";
import { registerSchema } from "../validations/register.validation";
import { loginSchema } from "../validations/login.validation";
import { refreshSchema } from "../validations/refresh.validation";
import { authenticate } from "@/middleware/auth.middleware";
import { me } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", logout);

router.get("/me", authenticate, me);

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
