import { CallHandler, ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import { map, type Observable } from "rxjs";

import type { RequestWithContext } from "../dto/request-context.type";

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: "Request completed successfully",
        data,
        meta: {
          requestId: request.requestId ?? "unknown",
          timestamp: new Date().toISOString(),
          path: request.originalUrl
        }
      }))
    );
  }
}

