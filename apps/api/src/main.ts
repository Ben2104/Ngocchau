import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";

import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { RequestContextInterceptor } from "./common/interceptors/request-context.interceptor";
import { ResponseEnvelopeInterceptor } from "./common/interceptors/response-envelope.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false
  });

  app.enableCors({
    origin: process.env.APP_ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? ["http://localhost:3000"],
    credentials: true
  });
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1"
  });
  app.useGlobalInterceptors(new RequestContextInterceptor(), new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(Number(process.env.PORT ?? 4000));
}

void bootstrap();

