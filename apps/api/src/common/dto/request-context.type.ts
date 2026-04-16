import type { Request } from "express";

import type { AuthenticatedUser } from "@gold-shop/types";

export interface RequestWithContext extends Request {
  requestId?: string;
  requestStartedAt?: string;
  user?: AuthenticatedUser;
}

