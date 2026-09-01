import { NestFactory } from "@nestjs/core";

import { AppModule } from "src/app.module";
import { RevokePendingAuthTokensUseCase } from "src/auth/core/revokePendingAuthTokens.usecase";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(RevokePendingAuthTokensUseCase);
    await useCase.execute();
  } finally {
    await app.close();
  }
}
bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("revokePendingAuthTokens failed:", error);
  process.exit(1);
});
