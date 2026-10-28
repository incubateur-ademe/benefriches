/**
 * Target environment the e2e suite runs against, selected by E2E_TARGET_ENV.
 * Each target defines how tests read emails and which capabilities it offers.
 */

const TARGET_ENV_NAMES = ["local-stack", "production-like"] as const;

export type TargetEnvName = (typeof TARGET_ENV_NAMES)[number];

export type MailStrategy =
  // The docker e2e stack catches every email sent by the API.
  | { kind: "mail-catcher"; url: string }
  // No email can be read on this target yet.
  | { kind: "unavailable" };

export type TargetCapabilities = {
  // The API sends lifecycle emails (e.g. the welcome email on account creation).
  lifecycleEmails: boolean;
};

export type TargetEnv = {
  name: TargetEnvName;
  mail: MailStrategy;
  capabilities: TargetCapabilities;
};

function isTargetEnvName(value: string): value is TargetEnvName {
  return (TARGET_ENV_NAMES as readonly string[]).includes(value);
}

/**
 * Reads E2E_TARGET_ENV (default "local-stack") and throws on any value other than the
 * accepted ones. Call it after the stack environment file has been loaded.
 */
export function resolveTargetEnv(env: NodeJS.ProcessEnv = process.env): TargetEnv {
  const name = env.E2E_TARGET_ENV ?? "local-stack";
  if (!isTargetEnvName(name)) {
    const accepted = TARGET_ENV_NAMES.map((n) => `"${n}"`).join(", ");
    throw new Error(`Invalid E2E_TARGET_ENV "${name}": accepted values are ${accepted}`);
  }

  switch (name) {
    case "local-stack":
      return {
        name,
        mail: {
          kind: "mail-catcher",
          url: env.MAILCATCHER_URL ?? `http://localhost:${env.MAILCATCHER_UI_PORT ?? "1081"}`,
        },
        capabilities: { lifecycleEmails: true },
      };
    case "production-like":
      return {
        name,
        mail: { kind: "unavailable" },
        capabilities: { lifecycleEmails: false },
      };
  }
}
