import { NestFactory } from "@nestjs/core";

import { AppModule } from "src/app.module";
import { SendFirstProjectRemindersUseCase } from "src/notifications/core/usecases/sendFirstProjectReminders.usecase";
import { SendFirstSiteRemindersUseCase } from "src/notifications/core/usecases/sendFirstSiteReminders.usecase";

// Daily lifecycle reminders job (apps/api/scalingo/cron.json): `0 8 * * *`, every day at
// 08:00 UTC. Scalingo's cron runs in UTC, so that is 10:00 in Paris in summer (CEST) and
// 09:00 in winter (CET): the one-hour drift across daylight saving is accepted for a nudge.
// Every day, not weekdays only: with the 24–72 h window, weekday-only runs would never
// remind people who registered between Thursday 08:00 and Friday 08:00.
//
// `--dry-run` computes and logs each eligible cohort and sends nothing (no email, no ledger
// row), whatever LIFECYCLE_EMAILS_ENABLED says: run it against production data before
// turning the kill switch on. Without the flag, a no-op when LIFECYCLE_EMAILS_ENABLED is off.
//
// Two reminder cohorts, in order: the first site reminder (users registered 24–72 h ago with
// no site) and the first project reminder (one per custom or express active site created
// 24–72 h ago with no project). A user is never in both on the same run: the first requires
// no site at all, the second a site. Each cohort runs in its own try/catch, so one failing
// does not stop the next; a failure sets a non-zero exit code so the scheduler shows the
// failed run.
const REMINDER_USE_CASES = [
  SendFirstSiteRemindersUseCase,
  SendFirstProjectRemindersUseCase,
] as const;

async function bootstrap() {
  const dryRun = process.argv.includes("--dry-run");
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    for (const useCaseClass of REMINDER_USE_CASES) {
      try {
        await app.get(useCaseClass).execute({ dryRun });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`sendDailyLifecycleReminders: ${useCaseClass.name} failed:`, error);
        process.exitCode = 1;
      }
    }
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("sendDailyLifecycleReminders failed:", error);
  process.exit(1);
});
