import { CallHandler, ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Observable } from "rxjs";

import type { RequestWithContext } from "../dto/request-context.type";

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const response = context.switchToHttp().getResponse();

    request.requestId = request.headers["x-request-id"]?.toString() ?? randomUUID();
    request.requestStartedAt = new Date().toISOString();

    response.setHeader("x-request-id", request.requestId);

    return next.handle();
  }
}

