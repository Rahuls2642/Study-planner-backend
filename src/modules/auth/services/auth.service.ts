import bcrypt from "bcrypt";

import { ApiError } from "@/config/utils/ApiError";

import { RegisterInput } from "../validations/register.validation";
import { authRepository } from "../repositories/auth.repository";

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
}

export const authService = new AuthService();
