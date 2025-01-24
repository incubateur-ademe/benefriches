import { NestExpressApplication } from "@nestjs/platform-express";

export function configureServer(app: NestExpressApplication) {
  app.setGlobalPrefix("api");
  app.set("query parser", "extended"); // allow nested query params like arrays and objects
}
