import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import { ApiError } from "@/config/utils/ApiError";

import { RegisterInput } from "../validations/register.validation";
import { LoginInput } from "../validations/login.validation";
import { authRepository } from "../repositories/auth.repository";

import { Password as passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { sessionService } from "./session.service";

export class AuthService {
    async register(data: RegisterInput) {
        const existingUser = await authRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ApiError(409, "Email already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await authRepository.create({
            ...data,
            password: hashedPassword,
        });

        const { password, ...safeUser } = user;

        return safeUser;
    }

    async login(data: LoginInput) {
        const user = await authRepository.findByEmail(
            data.email
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid email or password"
            );
        }

        const passwordMatches =
            await passwordService.compare(
                data.password,
                user.password
            );

        if (!passwordMatches) {
            throw new ApiError(
                401,
                "Invalid email or password"
            );
        }

        const sessionId = randomUUID();

        const accessToken =
            tokenService.generateAccessToken({ id: user.id, email: user.email });

        const refreshToken =
            tokenService.generateRefreshToken(user.id, sessionId);

        await sessionService.create(
            user.id,
            sessionId,
            refreshToken
        );

        const { password, ...safeUser } = user;

        return {
            accessToken,
            refreshToken,
            user: safeUser,
        };
    }

    async refresh(refreshToken: string) {
        const payload = tokenService.verifyRefreshToken(refreshToken);

        const session = await sessionService.findById(payload.sessionId);

        if (!session) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const tokenMatches = sessionService.compareRefreshToken(
            refreshToken,
            session.refreshToken
        );

        if (!tokenMatches) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const user = await authRepository.findById(payload.userId);

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        const accessToken = tokenService.generateAccessToken({
            id: user.id,
            email: user.email,
        });

        const newRefreshToken = tokenService.generateRefreshToken(
            user.id,
            session.id
        );

        await sessionService.updateRefreshToken(session.id, newRefreshToken);

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        };
    }

    async logout(refreshToken: string) {
        const payload = tokenService.verifyRefreshToken(refreshToken);

        const session = await sessionService.findById(payload.sessionId);

        if (session) {
            await sessionService.delete(session.id);
        }

        return;
    }

    async me(userId: string) {
        const user = await authRepository.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        };
    }
}

export const authService = new AuthService();
