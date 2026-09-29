import { unsubscribeFromLifecycleEmailsRequestDtoSchema } from "shared";

import type { LifecycleEmailsGateway } from "../../core/LifecycleEmailsGateway";

export class HttpLifecycleEmailsService implements LifecycleEmailsGateway {
  async unsubscribe(token: string): Promise<void> {
    const parsedBody = unsubscribeFromLifecycleEmailsRequestDtoSchema.safeParse({ token });

    if (!parsedBody.success) {
      // Same code as the API: an empty token is an invalid link, not a technical error.
      throw new Error("INVALID_UNSUBSCRIBE_TOKEN");
    }

    const response = await fetch("/api/lifecycle-emails/unsubscribe", {
      method: "POST",
      body: JSON.stringify(parsedBody.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const { error } = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(error ?? "UNKNOWN_ERROR");
    }
  }
}
