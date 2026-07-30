import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "@/config/env";

class TokenService {
  generateAccessToken(user: { id: string; email: string }) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
      }
    );
  }

  generateRefreshToken(
    userId: string,
    sessionId: string
  ) {
    return jwt.sign(
      {
        userId,
        sessionId,
      },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
      }
    );
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      env.JWT_REFRESH_SECRET
    ) as JwtPayload;
  }
}

export const tokenService = new TokenService();