import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
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
    console.log("SQL connection looks good");
  } catch (err) {
    console.error("Error: could not establish SQL connection");
    console.error(err);
    await sqlConnection.destroy();
    process.exit(1);
  }

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

process.on("beforeExit", (code) => {
  console.log("Process beforeExit event with code: ", code);
});

process.on("exit", (code) => {
  console.log("Process exit event with code: ", code);
});

void bootstrap();
