// oxlint-disable no-console
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { Knex } from "knex";
import { z } from "zod";

import { AppModule } from "./app.module";
import { configureServer } from "./httpServer";
import { SqlConnection } from "./shared-kernel/adapters/sql-knex/sqlConnection.module";

// Only CONNECT_CRM_BASE_URL is validated at startup for now, so a misconfigured
// value fails fast at boot rather than as a silent runtime error.
const connectCrmBaseUrlSchema = z
  .string()
  .url(
    "CONNECT_CRM_BASE_URL must be a valid URL including the full API base path (e.g. https://api-interne.ademe.fr/api/v1)",
  );

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureServer(app);

  // fail fast if CONNECT_CRM_BASE_URL is missing or malformed
  const configService = app.get(ConfigService);
  const connectCrmBaseUrlResult = connectCrmBaseUrlSchema.safeParse(
    configService.get("CONNECT_CRM_BASE_URL"),
  );
  if (!connectCrmBaseUrlResult.success) {
    console.error(
      "Error: invalid environment configuration -",
      connectCrmBaseUrlResult.error.issues[0]?.message,
    );
    process.exit(1);
  }

  // test SQL connection so we fail fast if DB is not accesible
  const sqlConnection: Knex = app.get(SqlConnection);
  try {
    await sqlConnection.raw("SELECT 1");
  } catch (err) {
    console.error("Error: could not establish SQL connection");
    console.error(err);
    await sqlConnection.destroy();
    process.exit(1);
  }

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("API Bénéfriches")
    .setDescription("Calcul des coûts d'inaction sur les friches")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const publicPaths = new Set([
    "/api/friches/cout-inaction",
    "/api/stats/average-impacts/search",
    "/api/stats",
  ]);
  const publicDocument = {
    ...document,
    paths: Object.fromEntries(
      Object.entries(document.paths).filter(([path]) => {
        return publicPaths.has(path);
      }),
    ),
    components: {},
  };

  SwaggerModule.setup("api/docs", app, publicDocument);

  // run http server
  await app.listen(configService.getOrThrow("PORT"));
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

void bootstrap();
