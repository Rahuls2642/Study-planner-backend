import { createHash } from "crypto";

class HashService {
  sha256(value: string): string {
    return createHash("sha256")
      .update(value)
      .digest("hex");
  }
}

export const hashService = new HashService();
