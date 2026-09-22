import { NestFactory } from "@nestjs/core";

import { AppModule } from "src/app.module";
import { SendLifecycleEmailPreviewUseCase } from "src/notifications/core/usecases/sendLifecycleEmailPreview.usecase";

const USAGE =
  "Usage: node ./dist/src/notifications/adapters/primary/sendLifecycleEmailPreview.script.js --type=<emailType> --to=<address> [--to=<address> …]";

function parseArgs(argv: string[]): { emailType: string; recipients: string[] } {
  let emailType = "";
  const recipients: string[] = [];

  for (const arg of argv) {
    if (arg.startsWith("--type=")) {
      emailType = arg.slice("--type=".length);
      continue;
    }
    if (arg.startsWith("--to=")) {
      recipients.push(arg.slice("--to=".length));
      continue;
    }
    // eslint-disable-next-line no-console
    console.error(`Unknown argument "${arg}". ${USAGE}`);
    process.exit(1);
  }

  return { emailType, recipients };
}

async function bootstrap() {
  const { emailType, recipients } = parseArgs(process.argv.slice(2));
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(SendLifecycleEmailPreviewUseCase);
    const result = await useCase.execute({ emailType, recipients });

    if (result.isFailure()) {
      const error = result.getError();
      if (error === "NoRecipient") {
        // eslint-disable-next-line no-console
        console.error(`No recipient address given. ${USAGE}`);
      } else if (error === "UnknownEmailType") {
        // eslint-disable-next-line no-console
        console.error(
          `Unknown email type "${emailType}". Valid types: ${result.getIssues()?.validEmailTypes.join(", ")}`,
        );
      } else {
        // eslint-disable-next-line no-console
        console.error("Lifecycle email preview failed to send. See logs above for details.");
      }
      process.exitCode = 1;
    }
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("sendLifecycleEmailPreview failed:", error);
  process.exit(1);
});
