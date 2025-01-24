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
void bootstrap();
