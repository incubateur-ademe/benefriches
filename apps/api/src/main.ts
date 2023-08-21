import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const port = Number(process.env.PORT) || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
void bootstrap();
