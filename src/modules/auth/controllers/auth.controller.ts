import { Request, Response } from "express";

import { asyncHandler } from "@/config/utils/asyncHandler";
import { sendResponse } from "@/config/utils/apiResponse";

import { authService } from "../services/auth.service";
import { cookieService } from "../services/cookie.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    sendResponse(
        res,
        201,
        "User registered successfully",
        user
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    cookieService.setRefreshToken(
        res,
        result.refreshToken
    );

    sendResponse(res, 200, "Login successful", {
        accessToken: result.accessToken,
        user: result.user,
    });
});

export const refresh = asyncHandler(async (req, res) => {
    const result = await authService.refresh(
        req.cookies.refreshToken
    );

    cookieService.setRefreshToken(
        res,
        result.refreshToken
    );

    sendResponse(res, 200, "Token refreshed", {
        accessToken: result.accessToken,
        user: result.user,
    });
});

export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        await authService.logout(refreshToken);
    }

    cookieService.clearRefreshToken(res);

    sendResponse(res, 200, "Logged out successfully");
});
