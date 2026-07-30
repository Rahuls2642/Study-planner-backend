import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { ApiError } from "@/config/utils/ApiError";
import { tokenService } from "@/modules/auth/services/token.service";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  req.user = tokenService.verifyAccessToken(token);

  next();
};
