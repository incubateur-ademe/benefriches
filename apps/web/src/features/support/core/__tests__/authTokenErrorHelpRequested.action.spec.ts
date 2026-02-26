import { describe, expect, it } from "vitest";

import { InMemorySupportChatService } from "@/features/support/infrastructure/support-chat-service/InMemorySupportChatService";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { authTokenErrorHelpRequested } from "../authTokenErrorHelpRequested.action";

describe("authTokenErrorHelpRequested", () => {
  it("should open support chat with token error message", async () => {
    const supportChatService = new InMemorySupportChatService();
    const store = createStore(getTestAppDependencies({ supportChatService }));

    await store.dispatch(authTokenErrorHelpRequested());

    expect(supportChatService._messages).toEqual([
      "Bonjour, mon lien de connexion ne fonctionne pas. Pouvez-vous m'en envoyer un nouveau ?",
    ]);
  });
});
