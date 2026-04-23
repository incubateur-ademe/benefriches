// oxlint-disable no-console
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Knex } from "knex";

import { AppModule } from "./app.module";
import { configureServer } from "./httpServer";
import { SqlConnection } from "./shared-kernel/adapters/sql-knex/sqlConnection.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureServer(app);

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
  const publicPaths = new Set(["/api/friches/cout-inaction"]);
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
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow("PORT"));
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

void bootstrap();
