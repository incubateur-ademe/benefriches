import type { ConfigService } from "@nestjs/config";

import {
  lifecycleEmailContactSchema,
  type LifecycleEmailContact,
} from "src/notifications/core/models/lifecycleEmailContact";

// Reads the named contact of the reminder emails from LIFECYCLE_EMAILS_CONTACT_*. Any
// missing, empty or invalid value gives undefined rather than throwing: failing at boot
// would take the whole API down for a nudge email. The reminders are then skipped with a
// warning, and the preview falls back to its sample contact.
export function readLifecycleEmailContact(
  configService: ConfigService,
): LifecycleEmailContact | undefined {
  const parsed = lifecycleEmailContactSchema.safeParse({
    firstName: configService.get<string>("LIFECYCLE_EMAILS_CONTACT_FIRST_NAME"),
    lastName: configService.get<string>("LIFECYCLE_EMAILS_CONTACT_LAST_NAME"),
    role: configService.get<string>("LIFECYCLE_EMAILS_CONTACT_ROLE"),
    phone: configService.get<string>("LIFECYCLE_EMAILS_CONTACT_PHONE"),
    email: configService.get<string>("LIFECYCLE_EMAILS_CONTACT_EMAIL"),
  });
  return parsed.success ? parsed.data : undefined;
}
