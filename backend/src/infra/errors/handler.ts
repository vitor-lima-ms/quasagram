import HTTP from "http";
import { isAxiosError } from "axios";
import { isCelebrateError } from "celebrate";
import type { NextFunction, Request, Response } from "express";

import AppError from "../../app/errors/AppError.ts";
import AppHttpError from "../../app/errors/AppHttpError.ts";

export default async (
  err: Error,
  // @ts-expect-error The req var will be used in the future to register logs
  req: Request,
  res: Response,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // @ts-expect-error The next function dont need to be explicitly used
  next: NextFunction,
): Promise<Response> => {
  if (isCelebrateError(err)) {
    const statusCode = 422;
    const validation: Record<string, Record<string, string | string[]>> = {};

    err.details.entries().forEach(([segment, joiError]) => {
      validation[segment] = {
        source: segment,
        keys: joiError.details.map((detail) => detail.path.join()),
        message: joiError.message,
      };
    });

    return res.status(statusCode).json({
      statusCode,
      error: HTTP.STATUS_CODES[statusCode],
      message: err.message,
      validation,
    });
  }

  if (err instanceof AppError) {
    return res.status(500).json({
      message: err.message,
      code: err.errorCode,
    });
  }

  if (err instanceof AppHttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.errorCode,
      errors: err.errors,
    });
  }

  if (isAxiosError(err)) {
    return res.status(500).json({
      message: "Internal server error",
      errors: [err.response?.data],
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    errors: [err.message],
  });
};
