import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildUnsubscribeUrl } from "./unsubscribeUrl";

describe("buildUnsubscribeUrl", () => {
  it("builds the unsubscribe URL from the configured web app URL", () => {
    const url = buildUnsubscribeUrl("https://staging.benefriches.fr", "v1.abc.def");

    assert.strictEqual(
      url,
      "https://staging.benefriches.fr/emails/desinscription?token=v1.abc.def",
    );
  });
});
