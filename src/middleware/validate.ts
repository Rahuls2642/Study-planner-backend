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
        cookies: req.cookies,
      });

      req.body = validated.body;
      
      // In Express 5, req.query and req.params might be getters
      Object.defineProperty(req, 'query', {
        value: validated.query,
        writable: true,
        configurable: true
      });
      
      Object.defineProperty(req, 'params', {
        value: validated.params,
        writable: true,
        configurable: true
      });

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
