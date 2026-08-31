import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import compression from "compression";
import { Request, Response } from "express";
import helmet from "helmet";
import { cleanupOpenApiDoc } from "nestjs-zod";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & Optimization
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": [
            "'self'",
            "'unsafe-inline'",
            "https://cdn.jsdelivr.net",
          ],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "img-src": ["'self'", "data:", "https://cdn.jsdelivr.net"],
        },
      },
    }),
  );
  app.use(compression());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("Boilerplate API")
    .setDescription("API Documentation for Boilerplate Backend")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .build();

  const rawDocument = SwaggerModule.createDocument(app, config);
  const document = cleanupOpenApiDoc(rawDocument);

  // Serve OpenAPI JSON
  app.getHttpAdapter().get("/api-json", (_req: Request, res: Response) => {
    res.json(document);
  });

  // Serve Scalar API Reference UI
  app.use(
    "/api",
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
