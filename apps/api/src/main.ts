import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication, VersioningType } from "@nestjs/common";

import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { RequestContextInterceptor } from "./common/interceptors/request-context.interceptor";
import { ResponseEnvelopeInterceptor } from "./common/interceptors/response-envelope.interceptor";
import { AuthModule } from "./modules/auth/auth.module";
import { EmployeesModule } from "./modules/employees/employees.module";

function setupSwagger(app: INestApplication) {
  const swaggerEnabled = process.env.APP_SWAGGER_ENABLED === "true" && process.env.NODE_ENV !== "production";

  if (!swaggerEnabled) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle("Gold Shop System API")
    .setDescription("Swagger UI ưu tiên cho auth và quản lý nhân viên trong giai đoạn nối frontend/backend đầu tiên.")
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Dán access token lấy từ Supabase session để thử API bảo vệ."
      },
      "supabase-bearer"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, EmployeesModule]
  });

  SwaggerModule.setup("docs", app, document, {
    useGlobalPrefix: true,
    jsonDocumentUrl: "docs-json",
    swaggerOptions: {
      persistAuthorization: true
    }
  });
}

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
  setupSwagger(app);

  await app.listen(Number(process.env.PORT ?? 4000));
}

void bootstrap();
