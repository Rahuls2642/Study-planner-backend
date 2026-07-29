import { Request, Response } from "express";

import { asyncHandler } from "@/config/utils/asyncHandler";
import { sendResponse } from "@/config/utils/apiResponse";

import { authService } from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    sendResponse(
        res,
        201,
        "User registered successfully",
        user
    );
});
