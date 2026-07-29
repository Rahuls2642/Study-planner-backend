import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

import { ApiError } from "@/config/utils/ApiError";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = validated.body;
      req.params = validated.params;
      req.query = validated.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(
            400,
            error.errors.map((e) => e.message).join(", ")
          )
        );
      }

      next(error);
    }
  };
