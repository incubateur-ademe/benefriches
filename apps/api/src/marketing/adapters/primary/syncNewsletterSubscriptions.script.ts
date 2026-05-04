import { NestFactory } from "@nestjs/core";

import { AppModule } from "src/app.module";
import { SyncNewsletterSubscriptionsUseCase } from "src/marketing/core/usecases/syncNewsletterSubscriptions.usecase";

async function bootstrap() {
  const dryRun = process.argv.includes("--dry-run");
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(SyncNewsletterSubscriptionsUseCase);
    await useCase.execute({ dryRun });
  } finally {
    await app.close();
  }
}
bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("syncNewsletterSubscriptions failed:", error);
  process.exit(1);
});
