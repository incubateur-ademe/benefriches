import { NestFactory } from "@nestjs/core";

import { AppModule } from "src/app.module";
import { RevokeUnusedAuthTokensUseCase } from "src/auth/core/revokeUnusedAuthTokens.usecase";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(RevokeUnusedAuthTokensUseCase);
    await useCase.execute();
  } finally {
    await app.close();
  }
}
bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("revokeUnusedAuthTokens failed:", error);
  process.exit(1);
});
