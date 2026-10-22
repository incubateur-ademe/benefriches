// Makes an existing user an administrator of the back office. Exactly one of --email (trimmed,
// case-insensitive) or --user-id. Idempotent: an existing administrator is left unchanged.
// If a run fails after granting the rights (e.g. publishing administrator.granted failed),
// rerun it: the rerun publishes the missing event.
// Exit codes: 0 granted or no change, 1 usage error, unknown user or ambiguous email.
import { NestFactory } from "@nestjs/core";
import { parseArgs } from "node:util";
import { validate as isUuid } from "uuid";

import { GrantAdministratorRightsUseCase } from "src/admin/core/usecases/grantAdministratorRights.usecase";
import { AppModule } from "src/app.module";

const USAGE =
  "Usage: node ./dist/src/admin/adapters/primary/grantAdministratorRights.script.js (--email <email> | --user-id <uuid>)";

type ParsedArguments =
  { identifiedBy: "email"; email: string } | { identifiedBy: "userId"; userId: string };

function exitWithUsageError(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`${message} ${USAGE}`);
  process.exit(1);
}

function parseArguments(argv: string[]): ParsedArguments {
  let values: { email?: string; "user-id"?: string };
  try {
    ({ values } = parseArgs({
      args: argv,
      options: { email: { type: "string" }, "user-id": { type: "string" } },
      strict: true,
    }));
  } catch (error) {
    exitWithUsageError(error instanceof Error ? error.message : String(error));
  }

  const { email, "user-id": userId } = values;
  if (email !== undefined && userId !== undefined) {
    exitWithUsageError("Give either --email or --user-id, not both.");
  }
  if (email !== undefined) {
    if (email.trim() === "") {
      exitWithUsageError("--email needs a value.");
    }
    return { identifiedBy: "email", email };
  }
  if (userId !== undefined) {
    // An invalid id would otherwise reach Postgres as a uuid cast error.
    if (!isUuid(userId)) {
      exitWithUsageError(`--user-id "${userId}" is not a UUID.`);
    }
    return { identifiedBy: "userId", userId };
  }
  return exitWithUsageError("Give --email or --user-id.");
}

async function bootstrap() {
  const request = parseArguments(process.argv.slice(2));
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(GrantAdministratorRightsUseCase);
    const result = await useCase.execute(request);

    if (result.isSuccess()) {
      const { outcome, user } = result.getData();
      if (outcome === "granted") {
        // eslint-disable-next-line no-console
        console.log(`Granted administrator rights to ${user.email} (id ${user.id}).`);
      } else {
        // eslint-disable-next-line no-console
        console.log(`No change: ${user.email} (id ${user.id}) is already an administrator.`);
      }
      return;
    }

    const error = result.getError();
    if (error === "UserNotFound") {
      // eslint-disable-next-line no-console
      console.error(
        request.identifiedBy === "email"
          ? `No user found with email "${request.email}".`
          : `No user found with id "${request.userId}".`,
      );
    } else {
      const matchingUsers = result.getIssues()?.matchingUsers ?? [];
      // eslint-disable-next-line no-console
      console.error(
        [
          "Several users match this email:",
          ...matchingUsers.map(({ email, id }) => `  - ${email} (id ${id})`),
          "Rerun with --user-id to choose one.",
        ].join("\n"),
      );
    }
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("grantAdministratorRights failed:", error);
  process.exit(1);
});
