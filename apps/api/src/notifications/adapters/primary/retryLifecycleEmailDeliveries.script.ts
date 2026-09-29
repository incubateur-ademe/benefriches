import { NestFactory } from "@nestjs/core";

import { AppModule } from "src/app.module";
import { RetryLifecycleEmailDeliveriesUseCase } from "src/notifications/core/usecases/retryLifecycleEmailDeliveries.usecase";

// Hourly (apps/api/scalingo/cron.json). Retries "failed" and stranded "pending" lifecycle
// email deliveries; a no-op when LIFECYCLE_EMAILS_ENABLED is off. Logs one summary line.
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(RetryLifecycleEmailDeliveriesUseCase);
    await useCase.execute();
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("retryLifecycleEmailDeliveries failed:", error);
  process.exit(1);
});
