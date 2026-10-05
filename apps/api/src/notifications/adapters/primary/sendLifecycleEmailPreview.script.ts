// Sends a lifecycle email preview to explicitly given addresses. With
// --type=project-impacts-summary, --project-id=<id> renders that real project instead of the
// samples: its name and results (a real user's data when run on production) go to the given
// addresses, so use team addresses only.
import { NestFactory } from "@nestjs/core";

import { AppModule } from "src/app.module";
import { SendLifecycleEmailPreviewUseCase } from "src/notifications/core/usecases/sendLifecycleEmailPreview.usecase";

const USAGE =
  "Usage: node ./dist/src/notifications/adapters/primary/sendLifecycleEmailPreview.script.js --type=<emailType> [--project-id=<projectId>] --to=<address> [--to=<address> …] (--project-id only with --type=project-impacts-summary)";

function exitWithUsageError(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`${message} ${USAGE}`);
  process.exit(1);
}

function parseArgs(argv: string[]): {
  emailType: string;
  projectId: string | undefined;
  recipients: string[];
} {
  let emailType = "";
  let projectId: string | undefined;
  const recipients: string[] = [];

  for (const arg of argv) {
    if (arg.startsWith("--type=")) {
      emailType = arg.slice("--type=".length);
      continue;
    }
    if (arg.startsWith("--project-id=")) {
      if (projectId !== undefined) {
        exitWithUsageError("--project-id given more than once.");
      }
      projectId = arg.slice("--project-id=".length);
      // An empty id would reach the database and be reported as an impacts failure.
      if (projectId === "") {
        exitWithUsageError("--project-id needs a value.");
      }
      continue;
    }
    if (arg.startsWith("--to=")) {
      recipients.push(arg.slice("--to=".length));
      continue;
    }
    exitWithUsageError(`Unknown argument "${arg}".`);
  }

  return { emailType, projectId, recipients };
}

async function bootstrap() {
  const { emailType, projectId, recipients } = parseArgs(process.argv.slice(2));
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(SendLifecycleEmailPreviewUseCase);
    const result = await useCase.execute({ emailType, projectId, recipients });

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
      } else if (error === "ProjectIdNotSupported") {
        // eslint-disable-next-line no-console
        console.error("--project-id is only accepted with --type=project-impacts-summary.");
      } else if (error === "ReconversionProjectNotFound") {
        // eslint-disable-next-line no-console
        console.error(`No reconversion project with id "${projectId}".`);
      } else if (error === "ProjectImpactsNotComputed") {
        // eslint-disable-next-line no-console
        console.error(
          `The impacts of project "${projectId}" could not be computed. See logs above for details.`,
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
