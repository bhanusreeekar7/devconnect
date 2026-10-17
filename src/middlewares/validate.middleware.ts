import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const result = await schema.safeParseAsync(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        req.body = result.data;
        next();
    };
}
