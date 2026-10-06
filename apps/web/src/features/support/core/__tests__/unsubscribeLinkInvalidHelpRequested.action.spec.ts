import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { InMemorySupportChatService } from "@/features/support/infrastructure/support-chat-service/InMemorySupportChatService";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { unsubscribeLinkInvalidHelpRequested } from "../unsubscribeLinkInvalidHelpRequested.action";

describe("unsubscribeLinkInvalidHelpRequested", () => {
  it("opens the support chat with the invalid unsubscribe link message", async () => {
    const supportChatService = new InMemorySupportChatService();
    const store = createStore(getTestAppDependencies({ supportChatService }));

    await store.dispatch(unsubscribeLinkInvalidHelpRequested());

    expect(supportChatService._messages).toEqual([
      "Bonjour, mon lien de désinscription des e-mails Bénéfriches ne fonctionne pas.",
    ]);
  });
});
