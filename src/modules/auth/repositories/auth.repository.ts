import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, NewUser } from "@/db/schema";
import { BaseRepository } from "@/core/BaseRepository";

export class AuthRepository extends BaseRepository {
    async findByEmail(email: string) {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        return user ?? null;
    }

    async create(data: NewUser) {
        const [user] = await db
            .insert(users)
            .values(data)
            .returning();

        return user;
    }
}

export const authRepository = new AuthRepository();
