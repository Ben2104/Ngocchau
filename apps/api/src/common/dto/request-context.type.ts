import type { IncomingHttpHeaders } from "node:http";

import type { AuthenticatedUser } from "@gold-shop/types";

export interface RequestWithContext {
  headers: IncomingHttpHeaders;
  originalUrl: string;
  requestId?: string;
  requestStartedAt?: string;
  user?: AuthenticatedUser;
}
