import { z } from "zod";

export const refreshSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

export type RefreshInput = z.infer<typeof refreshSchema>["cookies"];
