import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import session from "express-session";

export function configureServer(app: NestExpressApplication) {
  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.use(
    session({
      secret: configService.getOrThrow<string>("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
      rolling: true,
    }),
  );
  app.set("query parser", "extended"); // allow nested query params like arrays and objects
}
