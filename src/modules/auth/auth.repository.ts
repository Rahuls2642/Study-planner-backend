import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { CreateUserDto } from "./auth.types";

export class AuthRepository {
    async findByEmail(email: string) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        return result[0] ?? null;
    }

    async create(data: CreateUserDto) {
        const result = await db
            .insert(users)
            .values(data)
            .returning();

        return result[0];
    }
}

export const authRepository = new AuthRepository();