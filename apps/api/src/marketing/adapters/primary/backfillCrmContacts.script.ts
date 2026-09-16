import { NestFactory } from "@nestjs/core";

import { AppModule } from "src/app.module";
import { BackfillCrmContactsUseCase } from "src/marketing/core/usecases/backfillCrmContacts.usecase";

async function bootstrap() {
  const dryRun = process.argv.includes("--dry-run");
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(BackfillCrmContactsUseCase);
    await useCase.execute({ dryRun });
  } finally {
    await app.close();
  }
}
bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("backfillCrmContacts failed:", error);
  process.exit(1);
});
