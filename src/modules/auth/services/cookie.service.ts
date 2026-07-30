import { Response } from "express";

import { env } from "@/config/env";

class CookieService {
    setRefreshToken(
        res: Response,
        token: string
    ) {
        res.cookie("refreshToken", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    clearRefreshToken(res: Response) {
        res.clearCookie("refreshToken");
    }
}

export const cookieService = new CookieService();
