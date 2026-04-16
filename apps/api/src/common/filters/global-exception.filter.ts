import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import type { Response } from "express";
import { ZodError } from "zod";

import type { RequestWithContext } from "../dto/request-context.type";
import { formatZodError } from "../utils/zod-error.util";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithContext>();
    const response = context.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let code = "INTERNAL_SERVER_ERROR";
    let details: unknown = undefined;

    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = "Validation failed";
      code = "VALIDATION_ERROR";
      details = formatZodError(exception);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object" && exceptionResponse) {
        const responseObject = exceptionResponse as {
          message?: string | string[];
          code?: string;
          details?: unknown;
        };

        message = Array.isArray(responseObject.message)
          ? responseObject.message.join(", ")
          : responseObject.message ?? message;
        code = responseObject.code ?? code;
        details = responseObject.details;
      }
    }

    response.status(status).json({
      success: false,
      message,
      data: null,
      meta: {
        requestId: request.requestId ?? "unknown",
        timestamp: new Date().toISOString(),
        path: request.originalUrl
      },
      error: {
        code,
        details
      }
    });
  }
}

