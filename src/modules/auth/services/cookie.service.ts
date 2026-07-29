import { Response } from "express";

export class CookieService {
    static setRefreshToken(res: Response, token: string) {
        res.cookie("refreshToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
    }

    static clearRefreshToken(res: Response) {
        res.clearCookie("refreshToken");
    }
}
