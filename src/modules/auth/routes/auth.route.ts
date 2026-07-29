import { Router } from "express";

import { register } from "../controllers/auth.controller";
import { validate } from "@/middleware/validate";
import { registerSchema } from "../validations/register.validation";
import { authenticate } from "@/middleware/authenticate";
const router = Router();

router.post("/register", validate(registerSchema), register);
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
