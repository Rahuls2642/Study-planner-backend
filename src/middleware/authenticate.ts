import { NextFunction, Request, Response } from "express";

import { ApiError } from "@/config/utils/ApiError";
import { TokenService } from "@/modules/auth/services/token.service";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return next(new ApiError(401, "Unauthorized"));
    }

    try {
        const token = authHeader.split(" ")[1];

        const payload = TokenService.verifyAccessToken(token) as {
            userId: string;
            email: string;
        };

        req.user = payload;

        next();
    } catch {
        next(new ApiError(401, "Invalid token"));
    }
};