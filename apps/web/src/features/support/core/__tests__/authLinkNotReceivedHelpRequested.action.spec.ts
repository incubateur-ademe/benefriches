import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { InMemorySupportChatService } from "@/features/support/infrastructure/support-chat-service/InMemorySupportChatService";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { authLinkNotReceivedHelpRequested } from "../authLinkNotReceivedHelpRequested.action";

describe("authLinkNotReceivedHelpRequested", () => {
  it("should open support chat with email in message", async () => {
    const supportChatService = new InMemorySupportChatService();
    const store = createStore(getTestAppDependencies({ supportChatService }));

    await store.dispatch(authLinkNotReceivedHelpRequested({ email: "user@example.com" }));

    expect(supportChatService._messages).toEqual([
      "Bonjour, je n'ai pas reçu mon lien de connexion. Mon adresse e-mail : user@example.com",
    ]);
  });

  it("should set user email on support chat", async () => {
    const supportChatService = new InMemorySupportChatService();
    const store = createStore(getTestAppDependencies({ supportChatService }));

    await store.dispatch(authLinkNotReceivedHelpRequested({ email: "user@example.com" }));

    expect(supportChatService._userEmail).toBe("user@example.com");
  });
});
