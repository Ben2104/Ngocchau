import { ServiceUnavailableException } from "@nestjs/common";

export class AppSetupException extends ServiceUnavailableException {
  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super({
      message,
      code,
      details
    });
  }
}
