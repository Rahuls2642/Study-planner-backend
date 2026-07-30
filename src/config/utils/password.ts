import bcrypt from "bcrypt";

export class Password {
    static hash(password: string) {
        return bcrypt.hash(password, 12);
    }

    static compare(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}