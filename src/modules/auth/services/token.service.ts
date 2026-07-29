import { v4 as uuid } from "uuid";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "@/config/env";

export interface JwtPayload {
    userId: string;
    email: string;
}
const createToken = (
    payload: object,
    secret: Secret,
    expiresIn: SignOptions["expiresIn"]
) => {
    return jwt.sign(payload, secret, {
        expiresIn,
    });
};

export class TokenService {
    static generateAccessToken(payload: JwtPayload) {
        return createToken(
            payload,
            env.JWT_ACCESS_SECRET,
            env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
        );
    }

    static generateRefreshToken(payload: JwtPayload) {
        return createToken(
            {
                ...payload,
                jti: uuid(),
            },
            env.JWT_REFRESH_SECRET,
            env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
        );
    }

    static verifyAccessToken(token: string) {
        return jwt.verify(token, env.JWT_ACCESS_SECRET);
    }

    static verifyRefreshToken(token: string) {
        return jwt.verify(token, env.JWT_REFRESH_SECRET);
    }
}
